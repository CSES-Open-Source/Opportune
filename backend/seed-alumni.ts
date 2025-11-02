import mongoose from "mongoose";
import User, { UserType } from "./src/models/User";
import Company from "./src/models/Company";
import dotenv from "dotenv";

dotenv.config();

async function seedAlumni() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI not found");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Get existing companies
    const companies = await Company.find({});
    console.log(`Found ${companies.length} companies`);

    if (companies.length === 0) {
      console.log("No companies found. Please run seed-companies.ts first.");
      await mongoose.connection.close();
      return;
    }

    // Clear existing alumni
    await User.deleteMany({ type: UserType.Alumni });
    console.log("Cleared existing alumni");

    const sampleAlumni = [
      {
        _id: "alumni_001",
        email: "john.smith@google.com",
        name: "John Smith",
        profilePicture:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/johnsmith",
        phoneNumber: "+1-555-0101",
        position: "Senior Software Engineer",
        company: companies.find((c) => c.name === "Google")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_002",
        email: "sarah.johnson@meta.com",
        name: "Sarah Johnson",
        profilePicture:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/sarahjohnson",
        phoneNumber: "+1-555-0102",
        position: "Product Manager",
        company: companies.find((c) => c.name === "Meta")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_003",
        email: "mike.chen@apple.com",
        name: "Mike Chen",
        profilePicture:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/mikechen",
        phoneNumber: "+1-555-0103",
        position: "iOS Developer",
        company: companies.find((c) => c.name === "Apple")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_004",
        email: "emily.davis@microsoft.com",
        name: "Emily Davis",
        profilePicture:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/emilydavis",
        phoneNumber: "+1-555-0104",
        position: "Cloud Solutions Architect",
        company: companies.find((c) => c.name === "Microsoft")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_005",
        email: "alex.rodriguez@amazon.com",
        name: "Alex Rodriguez",
        profilePicture:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/alexrodriguez",
        phoneNumber: "+1-555-0105",
        position: "Backend Engineer",
        company: companies.find((c) => c.name === "Amazon")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_006",
        email: "lisa.wang@netflix.com",
        name: "Lisa Wang",
        profilePicture:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/lisawang",
        phoneNumber: "+1-555-0106",
        position: "Data Scientist",
        company: companies.find((c) => c.name === "Netflix")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_007",
        email: "david.kim@tesla.com",
        name: "David Kim",
        profilePicture:
          "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/davidkim",
        phoneNumber: "+1-555-0107",
        position: "Autopilot Engineer",
        company: companies.find((c) => c.name === "Tesla")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_008",
        email: "jessica.brown@uber.com",
        name: "Jessica Brown",
        profilePicture:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/jessicabrown",
        phoneNumber: "+1-555-0108",
        position: "Mobile Engineer",
        company: companies.find((c) => c.name === "Uber")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_009",
        email: "ryan.patel@airbnb.com",
        name: "Ryan Patel",
        profilePicture:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/ryanpatel",
        phoneNumber: "+1-555-0109",
        position: "Full Stack Developer",
        company: companies.find((c) => c.name === "Airbnb")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_010",
        email: "amanda.taylor@spotify.com",
        name: "Amanda Taylor",
        profilePicture:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/amandataylor",
        phoneNumber: "+1-555-0110",
        position: "Machine Learning Engineer",
        company: companies.find((c) => c.name === "Spotify")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_011",
        email: "kevin.lee@slack.com",
        name: "Kevin Lee",
        profilePicture:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/kevinlee",
        phoneNumber: "+1-555-0111",
        position: "Frontend Engineer",
        company: companies.find((c) => c.name === "Slack")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_012",
        email: "rachel.garcia@zoom.us",
        name: "Rachel Garcia",
        profilePicture:
          "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/rachelgarcia",
        phoneNumber: "+1-555-0112",
        position: "Video Engineer",
        company: companies.find((c) => c.name === "Zoom")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_013",
        email: "tom.wilson@salesforce.com",
        name: "Tom Wilson",
        profilePicture:
          "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/tomwilson",
        phoneNumber: "+1-555-0113",
        position: "Sales Engineer",
        company: companies.find((c) => c.name === "Salesforce")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_014",
        email: "maria.lopez@adobe.com",
        name: "Maria Lopez",
        profilePicture:
          "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/marialopez",
        phoneNumber: "+1-555-0114",
        position: "UX Designer",
        company: companies.find((c) => c.name === "Adobe")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_015",
        email: "james.anderson@oracle.com",
        name: "James Anderson",
        profilePicture:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/jamesanderson",
        phoneNumber: "+1-555-0115",
        position: "Database Administrator",
        company: companies.find((c) => c.name === "Oracle")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_016",
        email: "sophie.martinez@ibm.com",
        name: "Sophie Martinez",
        profilePicture:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/sophiemartinez",
        phoneNumber: "+1-555-0116",
        position: "AI Research Scientist",
        company: companies.find((c) => c.name === "IBM")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_017",
        email: "carlos.hernandez@intel.com",
        name: "Carlos Hernandez",
        profilePicture:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/carloshernandez",
        phoneNumber: "+1-555-0117",
        position: "Hardware Engineer",
        company: companies.find((c) => c.name === "Intel")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_018",
        email: "priya.sharma@nvidia.com",
        name: "Priya Sharma",
        profilePicture:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/priyasharma",
        phoneNumber: "+1-555-0118",
        position: "GPU Architect",
        company: companies.find((c) => c.name === "NVIDIA")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_019",
        email: "marcus.johnson@amd.com",
        name: "Marcus Johnson",
        profilePicture:
          "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/marcusjohnson",
        phoneNumber: "+1-555-0119",
        position: "CPU Designer",
        company: companies.find((c) => c.name === "AMD")?._id,
        shareProfile: true,
      },
      {
        _id: "alumni_020",
        email: "elena.rodriguez@palantir.com",
        name: "Elena Rodriguez",
        profilePicture:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        type: UserType.Alumni,
        linkedIn: "https://linkedin.com/in/elenarodriguez",
        phoneNumber: "+1-555-0120",
        position: "Data Engineer",
        company: companies.find((c) => c.name === "Palantir")?._id,
        shareProfile: true,
      },
    ];

    await User.insertMany(sampleAlumni);
    console.log(`Added ${sampleAlumni.length} alumni`);

    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding alumni:", error);
    process.exit(1);
  }
}

seedAlumni();
