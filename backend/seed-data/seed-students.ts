import mongoose from "mongoose";
import User from "../src/models/User"; // Adjust path based on your project structure
import dotenv from "dotenv";

dotenv.config();

/*
 * USAGE:
 * First, edit the preservedUserIds list below to include
 * any STUDENT user IDs you want to preserve (e.g. your own).
 *
 * Then, run the following command to populate student users:
 * ts-node seed-students.ts
 */

/**
 * LIST OF IDs TO PRESERVE
 * Add any Student User IDs that you DO NOT want deleted to this `preservedUserIds` array.
 * For example, add your own _id here if you have a STUDENT account in the database.
 */
const preservedUserIds: string[] = [];

const sampleStudents = [
  {
    email: "alex.chen@university.edu",
    name: "Alex Chen",
    profilePicture:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
    type: "STUDENT",
    linkedIn: "https://www.linkedin.com/in/alexchen",
    hobbies: ["Photography", "Hiking"],
    skills: ["TypeScript", "React", "Node.js"],
    major: "Computer Science",
    classLevel: "JUNIOR",
    fieldOfInterest: ["Full Stack Development", "Cloud Computing"],
    projects: ["E-commerce API", "Portfolio Website"],
    companiesOfInterest: ["Google", "NVIDIA"],
    organizations: ["Computer Science Society"],
    specializations: ["Web Systems"],
    school: "Tech University",
  },
  {
    email: "maya.patel@state.edu",
    name: "Maya Patel",
    profilePicture:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    type: "STUDENT",
    linkedIn: "https://www.linkedin.com/in/mayapatel",
    hobbies: ["Painting", "Running"],
    skills: ["Python", "SQL", "Tableau"],
    major: "Data Science",
    classLevel: "SENIOR",
    fieldOfInterest: ["Data Analytics", "Machine Learning"],
    projects: ["Stock Market Predictor"],
    companiesOfInterest: ["Tesla", "Adobe"],
    organizations: ["Women in STEM"],
    specializations: ["Artificial Intelligence"],
    school: "State University",
  },
  {
    email: "jordan.smith@college.edu",
    name: "Jordan Smith",
    profilePicture:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    type: "STUDENT",
    linkedIn: "https://www.linkedin.com/in/jordansmith",
    hobbies: ["Gaming", "Cooking"],
    skills: ["Java", "C++", "Docker"],
    major: "Software Engineering",
    classLevel: "SOPHOMORE",
    fieldOfInterest: ["Cybersecurity", "Embedded Systems"],
    projects: ["Network Traffic Monitor"],
    companiesOfInterest: ["Intel", "IBM"],
    organizations: ["Cyber Defense Club"],
    specializations: ["Infrastructure"],
    school: "Institute of Technology",
  },
  {
    email: "liam.nguyen@uni.edu",
    name: "Liam Nguyen",
    profilePicture:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    type: "STUDENT",
    linkedIn: "https://www.linkedin.com/in/liamnguyen",
    hobbies: ["Basketball", "Guitar"],
    skills: ["C#", "Unity", "Maya"],
    major: "Game Design",
    classLevel: "FRESHMAN",
    fieldOfInterest: ["Game Development", "VR/AR"],
    projects: ["2D Platformer"],
    companiesOfInterest: ["Netflix", "Meta"],
    organizations: ["Game Dev Guild"],
    specializations: ["Interactive Media"],
    school: "Academy of Arts",
  },
  {
    email: "sarah.kim@global.edu",
    name: "Sarah Kim",
    profilePicture:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    type: "STUDENT",
    linkedIn: "https://www.linkedin.com/in/sarahkim",
    hobbies: ["Reading", "Travel"],
    skills: ["R", "Statistics", "Excel"],
    major: "Economics",
    classLevel: "OTHER",
    fieldOfInterest: ["Financial Technology", "Quantitative Research"],
    projects: ["Market Analysis Report"],
    companiesOfInterest: ["Uber", "Salesforce"],
    organizations: ["Finance Association"],
    specializations: ["Econometrics"],
    school: "Global Business School",
  },
  {
    email: "oscar.rodriguez@tech.edu",
    name: "Oscar Rodriguez",
    profilePicture:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    type: "STUDENT",
    linkedIn: "https://www.linkedin.com/in/oscarrod",
    hobbies: ["Cycling", "Baking"],
    skills: ["JavaScript", "HTML/CSS", "Figma"],
    major: "Digital Media",
    classLevel: "JUNIOR",
    fieldOfInterest: ["UX/UI Design", "Product Management"],
    projects: ["Smart Home App Design"],
    companiesOfInterest: ["Airbnb", "Slack"],
    organizations: ["Design Collective"],
    specializations: ["User Experience"],
    school: "Design Institute",
  },
  {
    email: "chloe.wilson@state.edu",
    name: "Chloe Wilson",
    profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    type: "STUDENT",
    linkedIn: "https://www.linkedin.com/in/chloewilson",
    hobbies: ["Yoga", "Volunteering"],
    skills: ["Go", "Kubernetes", "AWS"],
    major: "Cloud Architecture",
    classLevel: "SENIOR",
    fieldOfInterest: ["DevOps", "Site Reliability"],
    projects: ["Automated CI/CD Pipeline"],
    companiesOfInterest: ["Amazon", "Microsoft"],
    organizations: ["Cloud Computing Group"],
    specializations: ["Distrubuted Systems"],
    school: "Western University",
  },
  {
    email: "ethan.brown@poly.edu",
    name: "Ethan Brown",
    profilePicture:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    type: "STUDENT",
    linkedIn: "https://www.linkedin.com/in/ethanbrown",
    hobbies: ["Chess", "Swimming"],
    skills: ["Rust", "Assembly", "Verilog"],
    major: "Computer Engineering",
    classLevel: "SOPHOMORE",
    fieldOfInterest: ["Hardware Design", "Robotics"],
    projects: ["FPGA Traffic Controller"],
    companiesOfInterest: ["NVIDIA", "AMD"],
    organizations: ["IEEE Student Branch"],
    specializations: ["Microprocessors"],
    school: "Polytechnic University",
  },
  {
    email: "isabella.white@uni.edu",
    name: "Isabella White",
    profilePicture: "https://images.unsplash.com/photo-1554151228-14d9def656e4",
    type: "STUDENT",
    linkedIn: "https://www.linkedin.com/in/isabellawhite",
    hobbies: ["Skiing", "Writing"],
    skills: ["Swift", "CoreData", "Firebase"],
    major: "Mobile Development",
    classLevel: "FRESHMAN",
    fieldOfInterest: ["iOS Development", "Mobile UX"],
    projects: ["Task Tracker App"],
    companiesOfInterest: ["Apple", "Spotify"],
    organizations: ["App Developers Club"],
    specializations: ["Interface Design"],
    school: "Central University",
  },
  {
    email: "noah.davis@college.edu",
    name: "Noah Davis",
    profilePicture: "https://images.unsplash.com/photo-1552058544-f2b08422138a",
    type: "STUDENT",
    linkedIn: "https://www.linkedin.com/in/noahdavis",
    hobbies: ["Drums", "Tennis"],
    skills: ["PHP", "Laravel", "MySQL"],
    major: "Information Systems",
    classLevel: "JUNIOR",
    fieldOfInterest: ["Business Analysis", "Database Management"],
    projects: ["Inventory Management System"],
    companiesOfInterest: ["Oracle", "Zoom"],
    organizations: ["MIS Society"],
    specializations: ["Information Security"],
    school: "Business College",
  },
];

async function seedStudents() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI not found");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Clear existing student users except for the preserved IDs
    const deleteResult = await User.deleteMany({
      type: "STUDENT",
      _id: { $nin: preservedUserIds },
    });

    console.log(
      `Cleared ${deleteResult.deletedCount} existing student users (Preserved ${preservedUserIds.length} IDs: ${preservedUserIds.join(", ")})`,
    );

    // Insert new sample students
    await User.insertMany(sampleStudents);
    console.log(`Added ${sampleStudents.length} new student users`);

    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding students:", error);
    process.exit(1);
  }
}

seedStudents();
