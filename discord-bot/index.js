import { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// MongoDB connection
let db;
const connectToMongoDB = async () => {
  try {
    const mongoClient = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/unishift');
    await mongoClient.connect();
    db = mongoClient.db('unishift');
    console.log('Connected to MongoDB');
    
    // Set up change stream to listen for new questions
    const changeStream = db.collection('questions').watch();
    changeStream.on('change', async (change) => {
      if (change.operationType === 'insert') {
        await handleNewQuestion(change.fullDocument);
      }
    });
    
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

// Email transporter setup
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Handle new questions from website
const handleNewQuestion = async (question) => {
  try {
    const channel = client.channels.cache.get(process.env.DISCORD_QUESTIONS_CHANNEL_ID);
    if (!channel) {
      console.error('Questions channel not found');
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('New Question from Website')
      .setDescription(question.question)
      .setColor(0xFF6B35)
      .setFooter({ text: `From: ${question.email}` })
      .setTimestamp(question.timestamp);

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`respond_${question._id}`)
          .setLabel('Respond')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('📧')
      );

    await channel.send({ embeds: [embed], components: [row] });
  } catch (error) {
    console.error('Error handling new question:', error);
  }
};

// Slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add a donation to the database')
    .addNumberOption(option =>
      option.setName('amount')
        .setDescription('Donation amount in pounds')
        .setRequired(true)
        .setMinValue(0.01)
    ),
  
  new SlashCommandBuilder()
    .setName('view')
    .setDescription('View all donations with pagination')
    .addIntegerOption(option =>
      option.setName('page')
        .setDescription('Page number (default: 1)')
        .setMinValue(1)
    ),
];

// Register slash commands
const registerCommands = async () => {
  try {
    const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
    if (!guild) {
      console.error('Guild not found');
      return;
    }

    await guild.commands.set(commands);
    console.log('Slash commands registered successfully');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
};

// Bot ready event
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await connectToMongoDB();
  await registerCommands();
});

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;

    if (commandName === 'add') {
      const amount = interaction.options.getNumber('amount');
      
      const embed = new EmbedBuilder()
        .setTitle('Confirm Donation Addition')
        .setDescription(`Are you sure you want to add a donation of **£${amount.toFixed(2)}**?`)
        .setColor(0xFF6B35)
        .setTimestamp();

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`confirm_add_${amount}`)
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅'),
          new ButtonBuilder()
            .setCustomId('cancel_add')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('❌')
        );

      await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }

    if (commandName === 'view') {
      const page = interaction.options.getInteger('page') || 1;
      const itemsPerPage = 10;
      const skip = (page - 1) * itemsPerPage;

      try {
        const donations = await db.collection('donations')
          .find({})
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(itemsPerPage)
          .toArray();

        const totalDonations = await db.collection('donations').countDocuments();
        const totalPages = Math.ceil(totalDonations / itemsPerPage);
        const totalAmount = await db.collection('donations')
          .aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }])
          .toArray();

        const embed = new EmbedBuilder()
          .setTitle('Donation History')
          .setColor(0xFF6B35)
          .setFooter({ text: `Page ${page} of ${totalPages} | Total: £${totalAmount[0]?.total.toFixed(2) || '0.00'}` })
          .setTimestamp();

        if (donations.length === 0) {
          embed.setDescription('No donations found on this page.');
        } else {
          const donationList = donations.map((donation, index) => {
            const date = new Date(donation.timestamp).toLocaleDateString('en-GB');
            return `${skip + index + 1}. **£${donation.amount.toFixed(2)}** - ${date}`;
          }).join('\n');

          embed.setDescription(donationList);
        }

        const row = new ActionRowBuilder();
        
        if (page > 1) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`view_page_${page - 1}`)
              .setLabel('Previous')
              .setStyle(ButtonStyle.Secondary)
              .setEmoji('⬅️')
          );
        }

        if (page < totalPages) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`view_page_${page + 1}`)
              .setLabel('Next')
              .setStyle(ButtonStyle.Secondary)
              .setEmoji('➡️')
          );
        }

        const components = row.components.length > 0 ? [row] : [];
        await interaction.reply({ embeds: [embed], components, ephemeral: true });

      } catch (error) {
        console.error('Error fetching donations:', error);
        await interaction.reply({ content: 'Error fetching donations from database.', ephemeral: true });
      }
    }
  }

  // Handle button interactions
  if (interaction.isButton()) {
    const customId = interaction.customId;

    // Handle donation confirmation
    if (customId.startsWith('confirm_add_')) {
      const amount = parseFloat(customId.replace('confirm_add_', ''));
      
      try {
        const donation = {
          amount: amount,
          timestamp: new Date()
        };

        await db.collection('donations').insertOne(donation);

        const embed = new EmbedBuilder()
          .setTitle('Donation Added Successfully')
          .setDescription(`Added donation of **£${amount.toFixed(2)}** to the database.`)
          .setColor(0x00FF00)
          .setTimestamp();

        await interaction.update({ embeds: [embed], components: [] });
      } catch (error) {
        console.error('Error adding donation:', error);
        await interaction.update({ 
          content: 'Error adding donation to database.', 
          embeds: [], 
          components: [] 
        });
      }
    }

    // Handle donation cancellation
    if (customId === 'cancel_add') {
      const embed = new EmbedBuilder()
        .setTitle('Donation Addition Cancelled')
        .setDescription('The donation was not added to the database.')
        .setColor(0xFF0000)
        .setTimestamp();

      await interaction.update({ embeds: [embed], components: [] });
    }

    // Handle pagination for view command
    if (customId.startsWith('view_page_')) {
      const page = parseInt(customId.replace('view_page_', ''));
      const itemsPerPage = 10;
      const skip = (page - 1) * itemsPerPage;

      try {
        const donations = await db.collection('donations')
          .find({})
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(itemsPerPage)
          .toArray();

        const totalDonations = await db.collection('donations').countDocuments();
        const totalPages = Math.ceil(totalDonations / itemsPerPage);
        const totalAmount = await db.collection('donations')
          .aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }])
          .toArray();

        const embed = new EmbedBuilder()
          .setTitle('Donation History')
          .setColor(0xFF6B35)
          .setFooter({ text: `Page ${page} of ${totalPages} | Total: £${totalAmount[0]?.total.toFixed(2) || '0.00'}` })
          .setTimestamp();

        const donationList = donations.map((donation, index) => {
          const date = new Date(donation.timestamp).toLocaleDateString('en-GB');
          return `${skip + index + 1}. **£${donation.amount.toFixed(2)}** - ${date}`;
        }).join('\n');

        embed.setDescription(donationList);

        const row = new ActionRowBuilder();
        
        if (page > 1) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`view_page_${page - 1}`)
              .setLabel('Previous')
              .setStyle(ButtonStyle.Secondary)
              .setEmoji('⬅️')
          );
        }

        if (page < totalPages) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`view_page_${page + 1}`)
              .setLabel('Next')
              .setStyle(ButtonStyle.Secondary)
              .setEmoji('➡️')
          );
        }

        const components = row.components.length > 0 ? [row] : [];
        await interaction.update({ embeds: [embed], components });

      } catch (error) {
        console.error('Error fetching donations:', error);
        await interaction.update({ content: 'Error fetching donations from database.', embeds: [], components: [] });
      }
    }

    // Handle question response
    if (customId.startsWith('respond_')) {
      const questionId = customId.replace('respond_', '');
      
      const modal = new ModalBuilder()
        .setCustomId(`response_modal_${questionId}`)
        .setTitle('Respond to Question');

      const responseInput = new TextInputBuilder()
        .setCustomId('response_text')
        .setLabel('Your Response')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Type your response here...')
        .setRequired(true)
        .setMaxLength(2000);

      const actionRow = new ActionRowBuilder().addComponents(responseInput);
      modal.addComponents(actionRow);

      await interaction.showModal(modal);
    }
  }

  // Handle modal submissions
  if (interaction.isModalSubmit()) {
    if (interaction.customId.startsWith('response_modal_')) {
      const questionId = interaction.customId.replace('response_modal_', '');
      const response = interaction.fields.getTextInputValue('response_text');

      try {
        // Get the question from database
        const { ObjectId } = await import('mongodb');
        const question = await db.collection('questions').findOne({ _id: new ObjectId(questionId) });
        
        if (!question) {
          await interaction.reply({ content: 'Question not found in database.', ephemeral: true });
          return;
        }

        // Send email response
        const transporter = createEmailTransporter();
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: question.email,
          subject: 'Response to your UniSHIFT question',
          html: `
            <h2>Thank you for your question!</h2>
            <p><strong>Your question:</strong> ${question.question}</p>
            <p><strong>Our response:</strong> ${response}</p>
            <br>
            <p>Best regards,<br>The UniSHIFT Team</p>
          `
        };

        await transporter.sendMail(mailOptions);

        // Update question status in database
        await db.collection('questions').updateOne(
          { _id: new ObjectId(questionId) },
          { 
            $set: { 
              status: 'responded',
              response: response,
              respondedAt: new Date()
            }
          }
        );

        const embed = new EmbedBuilder()
          .setTitle('Response Sent Successfully')
          .setDescription(`Email response sent to ${question.email}`)
          .setColor(0x00FF00)
          .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });

      } catch (error) {
        console.error('Error sending response:', error);
        await interaction.reply({ content: 'Error sending email response.', ephemeral: true });
      }
    }
  }
});

// Error handling
client.on('error', console.error);

// Login to Discord
client.login(process.env.DISCORD_TOKEN);