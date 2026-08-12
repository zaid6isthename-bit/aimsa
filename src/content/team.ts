import type { TeamMember } from "./types";
import photoPranav from "@/assets/team/Pranav_Badgujar_Sports_Event_Head.webp.asset.json";
import photoAnannya from "@/assets/team/Anannya_Bangera_Sports_Event_Head.webp.asset.json";
import photoShrushti from "@/assets/team/Shrushti_Shinde_Team_Member.webp.asset.json";
import photoSoham from "@/assets/team/Soham_Mahajan_Team_Member.webp.asset.json";
import photoParinika from "@/assets/team/Parinika_Walunj_Team_Member.webp.asset.json";
import photoShreyaT from "@/assets/team/Shreya_Tripathi_Team_Member.webp.asset.json";
import photoTanushree from "@/assets/team/Tanushree_Lokare_Team_Member.webp.asset.json";
import photoShreyaY from "@/assets/team/Shreya_Yadav_Team_Member.webp.asset.json";
import photoAdi from "@/assets/team/Adi_Shenoy_Team_Member.webp.asset.json";
import photoSneha from "@/assets/team/Sneha_Karki_Event_Head.webp.asset.json";
import photoSahilEvent from "@/assets/team/Sahil_Gouda_Event_Head.webp.asset.json";
import photoSohamPatil from "@/assets/team/Soham_Patil_Sports_Head.webp.asset.json";
import photoAyush from "@/assets/team/Ayush_Pandey_Sports_Head.webp.asset.json";
import photoAditya from "@/assets/team/Aditya_Pandey_Publicity_Head.webp.asset.json";
import photoOm from "@/assets/team/Om_Shukla_Photography_and_Magazine_Head.webp.asset.json";
import photoVinay from "@/assets/team/Vinay_Kanojia_Photography_and_Magazine_Head.webp.asset.json";
import photoSwarangi from "@/assets/team/Swarangi_Parab_Creative_Head.webp.asset.json";
import photoAneesh from "@/assets/team/Aneesh_Chaurasia_Cultural_Head.webp.asset.json";
import photoPrasad from "@/assets/team/Prasad_Shetty_Cultural_Head.webp.asset.json";
import photoSaniya from "@/assets/team/Saniya_Pawar_President.webp.asset.json";
import photoVed from "@/assets/team/Ved_Ringe_President.webp.asset.json";
import photoShrushtee from "@/assets/team/Shrushtee_Ghule_Vice_President.webp.asset.json";
import photoVivek from "@/assets/team/Vivek_Singh_Vice_President.webp.asset.json";
import photoHaresh from "@/assets/team/Haresh_Chavan_Treasurer.webp.asset.json";
import photoJahanvi from "@/assets/team/Jahanvi_Chopkar_Treasurer.webp.asset.json";
import photoTanisha from "@/assets/team/Tanisha_Pandey_Technical_Secretary.webp.asset.json";
import photoRajkrishna from "@/assets/team/Rajkrishna_Yadav_Co-Technical_Secretary.webp.asset.json";
import photoZaid from "@/assets/team/Zaid_Mohammed_Team_member.webp.asset.json";

export const currentAcademicYear = "2025–26";

export const team: TeamMember[] = [
  {
    id: "saniya-pawar",
    name: "Saniya Pawar",
    role: "President",
    group: "Office Bearers",
    academicYear: currentAcademicYear,
    photo: photoSaniya.url,
    bio: "Leads the association, owns the annual activity plan and represents AIMSA to the department.",
    confirmed: true,
  },
  {
    id: "ved-ringe",
    name: "Ved Ringe",
    role: "President",
    group: "Office Bearers",
    academicYear: currentAcademicYear,
    photo: photoVed.url,
    bio: "Leads the association, owns the annual activity plan and represents AIMSA to the department.",
    confirmed: true,
  },
  {
    id: "shrushtee-ghule",
    name: "Shrushtee Ghule",
    role: "Vice President",
    group: "Office Bearers",
    academicYear: currentAcademicYear,
    photo: photoShrushtee.url,
    bio: "Supports programme delivery and coordinates between functional teams.",
    confirmed: true,
  },
  {
    id: "vivek-singh",
    name: "Vivek Singh",
    role: "Vice President",
    group: "Office Bearers",
    academicYear: currentAcademicYear,
    photo: photoVivek.url,
    bio: "Supports programme delivery and coordinates between functional teams.",
    confirmed: true,
  },
  {
    id: "jahanvi-chopkar",
    name: "Jahanvi Chopkar",
    role: "Treasurer",
    group: "Office Bearers",
    academicYear: currentAcademicYear,
    photo: photoJahanvi.url,
    bio: "Handles budgeting and accounts for association activities.",
    confirmed: true,
  },
  {
    id: "haresh-chavan",
    name: "Haresh Chavan",
    role: "Treasurer",
    group: "Office Bearers",
    academicYear: currentAcademicYear,
    photo: photoHaresh.url,
    bio: "Handles budgeting and accounts for association activities.",
    confirmed: true,
  },
  {
    id: "tanisha-pandey",
    name: "Tanisha Pandey",
    role: "Technical Secretary",
    group: "Technical",
    academicYear: currentAcademicYear,
    photo: photoTanisha.url,
    bio: "Runs workshops, project mentoring and the open source lab.",
    confirmed: true,
  },
  {
    id: "rajkrishna-yadav",
    name: "Rajkrishna Yadav",
    role: "Co-Technical Secretary",
    group: "Technical",
    academicYear: currentAcademicYear,
    photo: photoRajkrishna.url,
    confirmed: true,
  },
  {
    id: "zaid-mohammed",
    name: "Zaid Mohammed",
    role: "Team Member",
    group: "Technical",
    academicYear: currentAcademicYear,
    photo: photoZaid.url,
    confirmed: true,
  },
  {
    id: "pranav-badgujar",
    name: "Pranav Badgujar",
    role: "Sports Event Head",
    group: "Events",
    academicYear: currentAcademicYear,
    photo: photoPranav.url,
    confirmed: true,
  },
  {
    id: "anannya-bangera",
    name: "Anannya Bangera",
    role: "Sports Event Head",
    group: "Events",
    academicYear: currentAcademicYear,
    photo: photoAnannya.url,
    confirmed: true,
  },
  {
    id: "sahil-gouda",
    name: "Sahil Gouda",
    role: "Event Head",
    group: "Events",
    academicYear: currentAcademicYear,
    photo: photoSahilEvent.url,
    confirmed: true,
  },
  {
    id: "sneha-karki",
    name: "Sneha Karki",
    role: "Event Head",
    group: "Events",
    academicYear: currentAcademicYear,
    photo: photoSneha.url,
    confirmed: true,
  },
  {
    id: "soham-patil",
    name: "Soham Patil",
    role: "Sports Head",
    group: "Events",
    academicYear: currentAcademicYear,
    photo: photoSohamPatil.url,
    confirmed: true,
  },
  {
    id: "ayush-pandey",
    name: "Ayush Pandey",
    role: "Sports Head",
    group: "Events",
    academicYear: currentAcademicYear,
    photo: photoAyush.url,
    confirmed: true,
  },
  {
    id: "aneesh-chaurasia",
    name: "Aneesh Chaurasia",
    role: "Cultural Head",
    group: "Events",
    academicYear: currentAcademicYear,
    photo: photoAneesh.url,
    confirmed: true,
  },
  {
    id: "prasad-shetty",
    name: "Prasad Shetty",
    role: "Cultural Head",
    group: "Events",
    academicYear: currentAcademicYear,
    photo: photoPrasad.url,
    confirmed: true,
  },
  {
    id: "aditya-pandey",
    name: "Aditya Pandey",
    role: "Publicity Head",
    group: "Design & Media",
    academicYear: currentAcademicYear,
    photo: photoAditya.url,
    confirmed: true,
  },
  {
    id: "om-shukla",
    name: "Om Shukla",
    role: "Photography & Magazine Head",
    group: "Design & Media",
    academicYear: currentAcademicYear,
    photo: photoOm.url,
    confirmed: true,
  },
  {
    id: "vinay-kanojia",
    name: "Vinay Kanojia",
    role: "Photography & Magazine Head",
    group: "Design & Media",
    academicYear: currentAcademicYear,
    photo: photoVinay.url,
    confirmed: true,
  },
  {
    id: "swarangi-parab",
    name: "Swarangi Parab",
    role: "Creative Head",
    group: "Design & Media",
    academicYear: currentAcademicYear,
    photo: photoSwarangi.url,
    confirmed: true,
  },
  {
    id: "shrushti-shinde",
    name: "Shrushti Shinde",
    role: "Team Member",
    group: "Events",
    academicYear: currentAcademicYear,
    photo: photoShrushti.url,
    confirmed: true,
  },
  {
    id: "soham-mahajan",
    name: "Soham Mahajan",
    role: "Team Member",
    group: "Events",
    academicYear: currentAcademicYear,
    photo: photoSoham.url,
    confirmed: true,
  },
  {
    id: "parinika-walunj",
    name: "Parinika Walunj",
    role: "Team Member",
    group: "Events",
    academicYear: currentAcademicYear,
    photo: photoParinika.url,
    confirmed: true,
  },
  {
    id: "shreya-tripathi",
    name: "Shreya Tripathi",
    role: "Team Member",
    group: "Events",
    academicYear: currentAcademicYear,
    photo: photoShreyaT.url,
    confirmed: true,
  },
  {
    id: "tanushree-lokare",
    name: "Tanushree Lokare",
    role: "Team Member",
    group: "Events",
    academicYear: currentAcademicYear,
    photo: photoTanushree.url,
    confirmed: true,
  },
  {
    id: "shreya-yadav",
    name: "Shreya Yadav",
    role: "Team Member",
    group: "Events",
    academicYear: currentAcademicYear,
    photo: photoShreyaY.url,
    confirmed: true,
  },
  {
    id: "adi-shenoy",
    name: "Adi Shenoy",
    role: "Team Member",
    group: "Events",
    academicYear: currentAcademicYear,
    photo: photoAdi.url,
    confirmed: true,
  },
];

export const teamGroups = [
  { id: "Office Bearers", label: "Office bearers", blurb: "Elected student leadership for the academic year." },
  { id: "Technical", label: "Technical team", blurb: "Workshops, project mentoring and technical content." },
  { id: "Events", label: "Events team", blurb: "Planning, logistics and delivery of every AIMSA event." },
  { id: "Design & Media", label: "Design & media team", blurb: "Brand, creatives, documentation and outreach." },
] as const;
