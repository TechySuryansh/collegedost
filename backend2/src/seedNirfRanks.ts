import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from './models/College';
import connectDB from './config/db';

dotenv.config();

// ─── NIRF 2025 Rankings Data ────────────────────────────────────────────────────
// Scraped from https://www.nirfindia.org/Rankings/2025/Ranking.html

interface NirfEntry {
    name: string;
    rank: number;
}

// ─── Engineering Rankings (Top 100) ─────────────────────────────────────────────
const engineeringRankings: NirfEntry[] = [
    { name: "Indian Institute of Technology Madras", rank: 1 },
    { name: "Indian Institute of Technology Delhi", rank: 2 },
    { name: "Indian Institute of Technology Bombay", rank: 3 },
    { name: "Indian Institute of Technology Kanpur", rank: 4 },
    { name: "Indian Institute of Technology Kharagpur", rank: 5 },
    { name: "Indian Institute of Technology Roorkee", rank: 6 },
    { name: "Indian Institute of Technology Hyderabad", rank: 7 },
    { name: "Indian Institute of Technology Guwahati", rank: 8 },
    { name: "National Institute of Technology Tiruchirappalli", rank: 9 },
    { name: "Indian Institute of Technology (Banaras Hindu University) Varanasi", rank: 10 },
    { name: "Birla Institute of Technology & Science -Pilani", rank: 11 },
    { name: "Indian Institute of Technology Indore", rank: 12 },
    { name: "National Institute of Technology Rourkela", rank: 13 },
    { name: "S.R.M. Institute of Science and Technology", rank: 14 },
    { name: "Indian Institute of Technology (Indian School of Mines)", rank: 15 },
    { name: "Vellore Institute of Technology", rank: 16 },
    { name: "National Institute of Technology Karnataka, Surathkal", rank: 17 },
    { name: "Jadavpur University", rank: 18 },
    { name: "Indian Institute of Technology Patna", rank: 19 },
    { name: "Anna University", rank: 20 },
    { name: "National Institute of Technology Calicut", rank: 21 },
    { name: "Siksha `O` Anusandhan", rank: 22 },
    { name: "Amrita Vishwa Vidyapeetham", rank: 23 },
    { name: "Jamia Millia Islamia", rank: 24 },
    { name: "Indian Institute of Technology Gandhinagar", rank: 25 },
    { name: "Indian Institute of Technology Mandi", rank: 26 },
    { name: "Indian Institute of Technology Jodhpur", rank: 27 },
    { name: "National Institute of Technology Warangal", rank: 28 },
    { name: "Thapar Institute of Engineering and Technology", rank: 29 },
    { name: "Delhi Technological University", rank: 30 },
    { name: "Chandigarh University", rank: 31 },
    { name: "Indian Institute of Technology Ropar", rank: 32 },
    { name: "Kalasalingam Academy of Research and Education", rank: 33 },
    { name: "Aligarh Muslim University", rank: 34 },
    { name: "Koneru Lakshmaiah Education Foundation University", rank: 35 },
    { name: "Kalinga Institute of Industrial Technology", rank: 36 },
    { name: "Amity University", rank: 37 },
    { name: "International Institute of Information Technology Hyderabad", rank: 38 },
    { name: "Indian Institute of Technology Bhubaneswar", rank: 39 },
    { name: "Shanmugha Arts Science Technology & Research Academy", rank: 40 },
    { name: "Institute of Chemical Technology", rank: 41 },
    { name: "Malaviya National Institute of Technology", rank: 42 },
    { name: "UPES", rank: 43 },
    { name: "Visvesvaraya National Institute of Technology, Nagpur", rank: 44 },
    { name: "Saveetha Institute of Medical and Technical Sciences", rank: 45 },
    { name: "Symbiosis International", rank: 46 },
    { name: "Sri Sivasubramaniya Nadar College of Engineering", rank: 47 },
    { name: "Lovely Professional University", rank: 48 },
    { name: "National Institute of Technology Durgapur", rank: 49 },
    { name: "National Institute of Technology Silchar", rank: 50 },
    { name: "Birla Institute of Technology", rank: 51 },
    { name: "Graphic Era University", rank: 52 },
    { name: "National Institute of Technology Patna", rank: 53 },
    { name: "Indian Institute of Engineering Science and Technology, Shibpur", rank: 54 },
    { name: "Dr. B R Ambedkar National Institute of Technology, Jalandhar", rank: 55 },
    { name: "Indian Institute of Technology Jammu", rank: 56 },
    { name: "Indian Institute of Technology, Tirupati", rank: 57 },
    { name: "Manipal University Jaipur", rank: 58 },
    { name: "Manipal Institute of Technology", rank: 59 },
    { name: "Madan Mohan Malaviya University of Technology", rank: 60 },
    { name: "Indian Institute of Space Science and Technology", rank: 61 },
    { name: "Motilal Nehru National Institute of Technology", rank: 62 },
    { name: "Indraprastha Institute of Information Technology", rank: 63 },
    { name: "Indian Institute of Technology Palakkad", rank: 64 },
    { name: "National Institute of Technology Delhi", rank: 65 },
    { name: "Sardar Vallabhbhai National Institute of Technology", rank: 66 },
    { name: "PSG College of Technology", rank: 67 },
    { name: "Sathyabama Institute of Science and Technology", rank: 67 },
    { name: "International Institute of Information Technology Bangalore", rank: 69 },
    { name: "Netaji Subhas University of Technology", rank: 70 },
    { name: "Banasthali Vidyapith", rank: 71 },
    { name: "Indian Institute of Technology Bhilai", rank: 72 },
    { name: "National Institute of Technology Srinagar", rank: 73 },
    { name: "University of Hyderabad", rank: 74 },
    { name: "M. S. Ramaiah Institute of Technology", rank: 75 },
    { name: "Christ University", rank: 76 },
    { name: "Indian Institute of Technology Dharwad", rank: 77 },
    { name: "Rajiv Gandhi Institute of Petroleum Technology", rank: 78 },
    { name: "Sant Longowal Institute of Engineering & Technology", rank: 79 },
    { name: "Vignan's Foundation for Science, Technology and Research", rank: 80 },
    { name: "Maulana Azad National Institute of Technology", rank: 81 },
    { name: "National Institute of Technology, Jamshedpur", rank: 82 },
    { name: "National Institute of Technology Meghalaya", rank: 83 },
    { name: "Jain university,Bangalore", rank: 84 },
    { name: "National Institute of Technology Kurukshetra", rank: 85 },
    { name: "National Institute of Technology, Raipur", rank: 86 },
    { name: "Vel Tech Rangarajan Dr. Sagunthala R & D Institute of Science and Technology", rank: 87 },
    { name: "AU College of Engineering", rank: 88 },
    { name: "Chitkara University", rank: 89 },
    { name: "COEP Technological University", rank: 90 },
    { name: "SR University", rank: 91 },
    { name: "Defence Institute of Advanced Technology", rank: 92 },
    { name: "Panjab University", rank: 93 },
    { name: "Jawaharlal Nehru Technological University", rank: 94 },
    { name: "C.V. Raman Global University, Odisha", rank: 95 },
    { name: "Atal Bihari Vajpayee Indian Institute of Information Technology and Management", rank: 96 },
    { name: "National Institute of Technology Hamirpur", rank: 97 },
    { name: "Pandit Deendayal Energy University", rank: 98 },
    { name: "National Institute of Technology Puducherry", rank: 99 },
    { name: "Sri Krishna College of Engineering and Technology", rank: 100 },
];

// ─── Management Rankings (Top 100) ──────────────────────────────────────────────
const managementRankings: NirfEntry[] = [
    { name: "Indian Institute of Management Ahmedabad", rank: 1 },
    { name: "Indian Institute of Management Bangalore", rank: 2 },
    { name: "Indian Institute of Management Kozhikode", rank: 3 },
    { name: "Indian Institute of Technology Delhi", rank: 4 },
    { name: "Indian Institute of Management Lucknow", rank: 5 },
    { name: "Indian Institute of Management, Mumbai", rank: 6 },
    { name: "Indian Institute of Management Calcutta", rank: 7 },
    { name: "Indian Institute of Management Indore", rank: 8 },
    { name: "Management Development Institute", rank: 9 },
    { name: "XLRI - Xavier School of Management", rank: 10 },
    { name: "Symbiosis Institute of Business Management", rank: 11 },
    { name: "Indian Institute of Technology Kharagpur", rank: 12 },
    { name: "Indian Institute of Technology Madras", rank: 13 },
    { name: "Indian Institute of Technology Bombay", rank: 14 },
    { name: "Indian Institute of Management Raipur", rank: 15 },
    { name: "Indian Institute of Management Tiruchirappalli", rank: 16 },
    { name: "Indian Institute of Foreign Trade", rank: 17 },
    { name: "Indian Institute of Management Ranchi", rank: 18 },
    { name: "Indian Institute of Management Rohtak", rank: 19 },
    { name: "S. P. Jain Institute of Management and Research", rank: 20 },
    { name: "Indian Institute of Management Udaipur", rank: 21 },
    { name: "Indian Institute of Technology Roorkee", rank: 22 },
    { name: "Indian Institute of Management Kashipur", rank: 23 },
    { name: "SVKM`s Narsee Monjee Institute of Management Studies", rank: 24 },
    { name: "Indian Institute of Management Shillong", rank: 25 },
    { name: "Amrita Vishwa Vidyapeetham", rank: 26 },
    { name: "Indian Institute of Technology Kanpur", rank: 27 },
    { name: "Jamia Millia Islamia", rank: 28 },
    { name: "Indian Institute of Management Visakhapatnam", rank: 29 },
    { name: "Institute of Management Technology", rank: 30 },
    { name: "Indian Institute of Management Bodh Gaya", rank: 31 },
    { name: "Chandigarh University", rank: 32 },
    { name: "MICA", rank: 33 },
    { name: "Indian Institute of Management Sambalpur", rank: 34 },
    { name: "Indian Institute of Management Jammu", rank: 35 },
    { name: "UPES", rank: 36 },
    { name: "Great Lakes Institute of Management", rank: 37 },
    { name: "Indian Institute of Management Shillong", rank: 38 },
    { name: "T. A. Pai Management Institute Manipal", rank: 39 },
    { name: "IMI Delhi", rank: 40 },
    { name: "Jaipuria Institute of Management", rank: 41 },
    { name: "IMI Kolkata", rank: 42 },
    { name: "Goa Institute of Management", rank: 43 },
    { name: "Lovely Professional University", rank: 44 },
    { name: "XIM University", rank: 45 },
    { name: "ICFAI Foundation for Higher Education, Hyderabad", rank: 46 },
    { name: "Thapar Institute of Engineering and Technology", rank: 46 },
    { name: "Indian Institute of Technology (Indian School of Mines)", rank: 48 },
    { name: "Amity University", rank: 49 },
    { name: "Great Lakes Institute of Management", rank: 50 },
    { name: "Indian Institute of Management Sirmaur", rank: 51 },
    { name: "Graphic Era University", rank: 52 },
    { name: "Nirma University", rank: 53 },
    { name: "Institute of Rural Management Anand", rank: 54 },
    { name: "Loyola Institute of Business Administration", rank: 55 },
    { name: "S.R.M. Institute of Science and Technology", rank: 56 },
    { name: "Christ University", rank: 57 },
    { name: "National Institute of Technology Tiruchirappalli", rank: 57 },
    { name: "Fore School of Management", rank: 59 },
    { name: "Banaras Hindu University", rank: 60 },
    { name: "Birla Institute of Management Technology", rank: 61 },
    { name: "Malaviya National Institute of Technology", rank: 62 },
    { name: "Saveetha Institute of Medical and Technical Sciences", rank: 63 },
    { name: "Indian Institute of Management, Amritsar", rank: 64 },
    { name: "K.J.Somaiya Institute of Management", rank: 65 },
    { name: "Siksha `O` Anusandhan", rank: 66 },
    { name: "Jaipuria Institute of Management, Lucknow", rank: 67 },
    { name: "Kalinga Institute of Industrial Technology", rank: 68 },
    { name: "Aligarh Muslim University", rank: 69 },
    { name: "Koneru Lakshmaiah Education Foundation University", rank: 70 },
    { name: "Alliance University", rank: 71 },
    { name: "Institute of Management Technology", rank: 72 },
    { name: "Jain university, Bangalore", rank: 73 },
    { name: "Jaipuria Institute of Management", rank: 74 },
    { name: "Prin. L.N. Welingkar Institute of Management Development and Research", rank: 75 },
    { name: "Guru Gobind Singh Indraprastha University", rank: 76 },
    { name: "BML Munjal University", rank: 77 },
    { name: "Chitkara University", rank: 78 },
    { name: "Babasheb Bhimrao Ambedkar University", rank: 79 },
    { name: "Thiagarajar School of Management", rank: 80 },
    { name: "Manipal University Jaipur", rank: 81 },
    { name: "Cochin University of Science and Technology", rank: 82 },
    { name: "Madan Mohan Malaviya University of Technology", rank: 83 },
    { name: "PSG College of Technology", rank: 84 },
    { name: "National Institute of Technology Calicut", rank: 85 },
    { name: "New Delhi Institute of Management", rank: 86 },
    { name: "Jamia Hamdard", rank: 87 },
    { name: "Anna University", rank: 88 },
    { name: "Pandit Deendayal Energy University", rank: 89 },
    { name: "Jagan Institute of Management Studies", rank: 90 },
    { name: "Rajagiri Business School", rank: 91 },
    { name: "Panjab University", rank: 92 },
    { name: "Atal Bihari Vajpayee Indian Institute of Information Technology and Management", rank: 93 },
    { name: "IMI Bhubaneswar", rank: 94 },
    { name: "National Institute of Agricultural Extension Management", rank: 95 },
    { name: "Bharathidasan Institute of Management", rank: 96 },
    { name: "Birla Institute of Technology", rank: 97 },
    { name: "Indian Institute of Technology Jodhpur", rank: 98 },
    { name: "Institute of Management Technology, Nagpur", rank: 99 },
    { name: "University of Lucknow", rank: 100 },
];

// ─── Medical Rankings (Top 50) ──────────────────────────────────────────────────
const medicalRankings: NirfEntry[] = [
    { name: "All India Institute of Medical Sciences, Delhi", rank: 1 },
    { name: "Post Graduate Institute of Medical Education and Research", rank: 2 },
    { name: "Christian Medical College", rank: 3 },
    { name: "Jawaharlal Institute of Post Graduate Medical Education & Research", rank: 4 },
    { name: "Sanjay Gandhi Postgraduate Institute of Medical Sciences", rank: 5 },
    { name: "Banaras Hindu University", rank: 6 },
    { name: "National Institute of Mental Health & Neuro Sciences, Bangalore", rank: 7 },
    { name: "King George`s Medical University", rank: 8 },
    { name: "Amrita Vishwa Vidyapeetham", rank: 9 },
    { name: "Kasturba Medical College, Manipal", rank: 10 },
    { name: "Saveetha Institute of Medical and Technical Sciences", rank: 11 },
    { name: "Dr. D. Y. Patil Vidyapeeth", rank: 12 },
    { name: "All India Institute of Medical Sciences Rishikesh", rank: 13 },
    { name: "All India Institute of Medical Sciences Bhubaneswar", rank: 14 },
    { name: "Siksha `O` Anusandhan", rank: 15 },
    { name: "Madras Medical College & Government General Hospital, Chennai", rank: 16 },
    { name: "Sree Chitra Tirunal Institute for Medical Sciences and Technology", rank: 17 },
    { name: "S.R.M. Institute of Science and Technology", rank: 18 },
    { name: "All India Institute of Medical Sciences Jodhpur", rank: 19 },
    { name: "Datta Meghe Institute of Higher Education and Research", rank: 20 },
    { name: "Sri Ramachandra Institute of Higher Education and Research", rank: 21 },
    { name: "Vardhman Mahavir Medical College & Safdarjung Hospital", rank: 22 },
    { name: "Institute of Post Graduate Medical Education & Research", rank: 23 },
    { name: "Kalinga Institute of Industrial Technology", rank: 24 },
    { name: "All India Institute of Medical Sciences Bhopal", rank: 25 },
    { name: "Maulana Azad Medical College", rank: 26 },
    { name: "All India Institute of Medical Sciences Patna", rank: 27 },
    { name: "Institute of Liver and Biliary Sciences", rank: 28 },
    { name: "Aligarh Muslim University", rank: 29 },
    { name: "St. John's Medical College", rank: 30 },
    { name: "All India Institute of Medical Sciences Raipur", rank: 31 },
    { name: "Lady Hardinge Medical College", rank: 32 },
    { name: "Maharishi Markandeshwar", rank: 33 },
    { name: "Govt. Medical College & Hospital", rank: 34 },
    { name: "Kasturba Medical College, Mangalore", rank: 35 },
    { name: "Dayanand Medical College", rank: 36 },
    { name: "JSS Medical College, Mysore", rank: 37 },
    { name: "University College of Medical Sciences", rank: 38 },
    { name: "Sawai Man Singh Medical College", rank: 39 },
    { name: "Jamia Hamdard", rank: 40 },
    { name: "Medical College", rank: 41 },
    { name: "Mahatma Gandhi Medical College and Research Institute", rank: 42 },
    { name: "PSG Institute of Medical Sciences and Research", rank: 43 },
    { name: "Gujarat Cancer & Research Institute", rank: 44 },
    { name: "B. J. Medical College", rank: 45 },
    { name: "Jawaharlal Nehru Medical College", rank: 46 },
    { name: "Christian Medical College, Brown Road, Ludhiana", rank: 47 },
    { name: "Osmania Medical College", rank: 48 },
    { name: "Chettinad Academy of Research and Education", rank: 49 },
    { name: "M. S. Ramaiah Medical College", rank: 50 },
];

// ─── Pharmacy Rankings (Top 100) ────────────────────────────────────────────────
const pharmacyRankings: NirfEntry[] = [
    { name: "Jamia Hamdard", rank: 1 },
    { name: "Birla Institute of Technology & Science -Pilani", rank: 2 },
    { name: "Panjab University", rank: 3 },
    { name: "JSS College of Pharmacy", rank: 4 },
    { name: "National Institute of Pharmaceutical Education and Research Hyderabad", rank: 5 },
    { name: "Institute of Chemical Technology", rank: 6 },
    { name: "JSS College of Pharmacy", rank: 7 },
    { name: "Manipal College of Pharmaceutical Sciences, Manipal", rank: 8 },
    { name: "National Institute of Pharmaceutical Education and Research, Mohali", rank: 9 },
    { name: "S.R.M. Institute of Science and Technology", rank: 10 },
    { name: "SVKM`s Narsee Monjee Institute of Management Studies", rank: 11 },
    { name: "National Institute of Pharmaceutical Education and Research Guwahati", rank: 12 },
    { name: "Lovely Professional University", rank: 13 },
    { name: "Amrita Vishwa Vidyapeetham", rank: 14 },
    { name: "Chandigarh University", rank: 15 },
    { name: "Chitkara University", rank: 16 },
    { name: "National Institute of Pharmaceutical Education and Research Raebareli", rank: 17 },
    { name: "Amity University", rank: 18 },
    { name: "Delhi Pharmaceutical Sciences and Research University", rank: 19 },
    { name: "Central University of Punjab", rank: 20 },
    { name: "National Institute of Pharmaceutical Education and Research Ahmedabad", rank: 21 },
    { name: "Banasthali Vidyapith", rank: 22 },
    { name: "Babasheb Bhimrao Ambedkar University", rank: 23 },
    { name: "Jadavpur University", rank: 24 },
    { name: "I. S. F. College of Pharmacy", rank: 25 },
    { name: "Maharishi Markandeshwar", rank: 26 },
    { name: "Central University of Rajasthan", rank: 27 },
    { name: "Birla Institute of Technology", rank: 28 },
    { name: "National Institute of Pharmaceutical Education and Research Kolkata", rank: 29 },
    { name: "National Institute Of Pharmaceutical Education And Research Hajipur", rank: 30 },
    { name: "AU College of Pharmaceutical Sciences, Andhra University", rank: 31 },
    { name: "Nirma University", rank: 32 },
    { name: "Gandhi Institute of Technology And Management (GITAM)", rank: 33 },
    { name: "Poona College of Pharmacy, Pune", rank: 34 },
    { name: "Dr D Y Patil Institute of Pharmaceutical Sciences and Research", rank: 35 },
    { name: "Sri Ramachandra Institute of Higher Education and Research", rank: 36 },
    { name: "Noida Institute of Engineering and Technology (Pharmacy Institute)", rank: 37 },
    { name: "SVKM`s Dr. Bhanuben Nanavati College of Pharmacy", rank: 38 },
    { name: "Suresh Gyan Vihar University", rank: 39 },
    { name: "Integral University", rank: 40 },
    { name: "Parul University", rank: 41 },
    { name: "Annamalai University", rank: 42 },
    { name: "Maharshi Dayanand University", rank: 43 },
    { name: "Shoolini University of Biotechnology and Management Sciences", rank: 44 },
    { name: "L. M. College of Pharmacy", rank: 45 },
    { name: "Maharaja Sayajirao University of Baroda", rank: 46 },
    { name: "Guru Ghasidas Vishwavidyalaya", rank: 47 },
    { name: "G. L. A. University", rank: 48 },
    { name: "Guru Jambheshwar University of Science and Technology, Hissar", rank: 49 },
    { name: "KLE College of Pharmacy, Belgaum", rank: 50 },
    { name: "N.G.S.M. Institute of Pharmaceutical Sciences", rank: 51 },
    { name: "R. C. Patel Institute of Pharmaceutical Education and Research", rank: 52 },
    { name: "Dibrugarh University", rank: 53 },
    { name: "The Rashtrasant Tukadoji Maharaj Nagpur University", rank: 54 },
    { name: "Galgotias University", rank: 55 },
    { name: "M.S. Ramaiah University of Applied Sciences", rank: 56 },
    { name: "Sharda University", rank: 57 },
    { name: "Gujarat Technological University", rank: 58 },
    { name: "Punjabi University, Patiala", rank: 59 },
    { name: "Sri Padmavathi Mahila Visvavidyalayam", rank: 60 },
    { name: "Vels Institute of Science Technology and Advanced Studies", rank: 61 },
    { name: "Amity University Haryana, Gurgaon", rank: 62 },
    { name: "Central University of South Bihar", rank: 63 },
    { name: "Mohan Lal Sukhadia University", rank: 64 },
    { name: "PSG College of Pharmacy", rank: 65 },
    { name: "Smt. Kishoritai Bhoyar College of Pharmacy", rank: 66 },
    { name: "Acharya Nagarjuna University College of Pharmaceutical Sciences", rank: 67 },
    { name: "Bundelkhand University", rank: 68 },
    { name: "Chandigarh College of Pharmacy, Landran", rank: 69 },
    { name: "Dr. Vishwanath Karad MIT World Peace University", rank: 70 },
    { name: "KIET Group of Institutions", rank: 71 },
    { name: "Anurag University", rank: 72 },
    { name: "Kumaun University, Nainital", rank: 73 },
    { name: "Sri Venkateswara College of Pharmacy", rank: 74 },
    { name: "Uttaranchal University", rank: 75 },
    { name: "Assam University-Silchar", rank: 76 },
    { name: "Nandha College of Pharmacy", rank: 77 },
    { name: "Bharati Vidyapeeth College of Pharmacy", rank: 78 },
    { name: "NIMS University, Jaipur", rank: 79 },
    { name: "Sri Adichunchanagiri College of Pharmacy", rank: 80 },
    { name: "Amar Shaheed Baba Ajit Singh Jujhar Singh Memorial College of Pharmacy", rank: 81 },
    { name: "Acharya & B M Reddy College of Pharmacy", rank: 82 },
    { name: "DIT University", rank: 83 },
    { name: "Maulana Abul Kalam Azad University of Technology", rank: 83 },
    { name: "Guru Nanak Institute of Pharmaceutical Science & Technology", rank: 85 },
    { name: "Mahatama Jyotiba Phule Rohikhand University, Bareilly", rank: 86 },
    { name: "Sam Higginbottom Institute of Agriculture, Technology & Sciences", rank: 87 },
    { name: "Y. B. Chavan College of Pharmacy", rank: 88 },
    { name: "Goa College of Pharmacy", rank: 89 },
    { name: "G. D. Goenka University", rank: 90 },
    { name: "Krupanidhi College of Pharmacy", rank: 91 },
    { name: "P. E. Society`s Modern College of Pharmacy", rank: 92 },
    { name: "IFTM University", rank: 93 },
    { name: "College of Pharmacy, Madras Medical College", rank: 94 },
    { name: "IES Institute of Pharmacy", rank: 95 },
    { name: "Arulmigu Kalasalingam College of Pharmacy", rank: 96 },
    { name: "JIS University", rank: 97 },
    { name: "Ramanbhai Patel College of Pharmacy", rank: 98 },
    { name: "Vinayaka Mission's Research Foundation", rank: 99 },
    { name: "Shree Guru Gobind Singh Tricentenary University", rank: 100 },
];

// ─── Law Rankings (Top 40) ──────────────────────────────────────────────────────
const lawRankings: NirfEntry[] = [
    { name: "National Law School of India University", rank: 1 },
    { name: "National Law University", rank: 2 },
    { name: "Nalsar University of Law", rank: 3 },
    { name: "The West Bengal National University of Juridical Sciences", rank: 4 },
    { name: "Gujarat National Law University", rank: 5 },
    { name: "Indian Institute of Technology Kharagpur", rank: 6 },
    { name: "Symbiosis Law School, Pune", rank: 7 },
    { name: "Jamia Millia Islamia", rank: 8 },
    { name: "Aligarh Muslim University", rank: 9 },
    { name: "Siksha `O` Anusandhan", rank: 10 },
    { name: "Shanmugha Arts Science Technology & Research Academy", rank: 11 },
    { name: "Babasheb Bhimrao Ambedkar University", rank: 12 },
    { name: "Cochin University of Science and Technology", rank: 13 },
    { name: "Kalinga Institute of Industrial Technology", rank: 14 },
    { name: "National Law University", rank: 15 },
    { name: "Dr. B. R. Ambedkar College of Law", rank: 16 },
    { name: "Chanakya National Law University", rank: 17 },
    { name: "UPES", rank: 18 },
    { name: "Saveetha Institute of Medical and Technical Sciences", rank: 19 },
    { name: "Alliance University", rank: 20 },
    { name: "Dr. Ram Manohar Lohiya National Law University, Lucknow", rank: 21 },
    { name: "Guru Gobind Singh Indraprastha University", rank: 22 },
    { name: "Central University of South Bihar", rank: 23 },
    { name: "Christ University", rank: 24 },
    { name: "S.R.M. Institute of Science and Technology", rank: 25 },
    { name: "Lovely Professional University", rank: 26 },
    { name: "National Law Institute University, Bhopal", rank: 27 },
    { name: "Maharashtra National Law University, Nagpur", rank: 28 },
    { name: "University of Lucknow", rank: 29 },
    { name: "National University of Study & Research in Law, Ranchi", rank: 30 },
    { name: "ICFAI Foundation for Higher Education, Hyderabad", rank: 31 },
    { name: "Manipal University Jaipur", rank: 32 },
    { name: "Nirma University", rank: 33 },
    { name: "Himachal Pradesh National Law University, Shimla", rank: 34 },
    { name: "National Law University and Judicial Academy", rank: 35 },
    { name: "Galgotias University", rank: 36 },
    { name: "Army Institute of Law", rank: 37 },
    { name: "Gandhi Institute of Technology And Management (GITAM)", rank: 38 },
    { name: "Amity University Haryana, Gurgaon", rank: 39 },
    { name: "Central University of Punjab", rank: 40 },
];

// ─── Matching Logic ─────────────────────────────────────────────────────────────

/**
 * Build a strict search regex for matching institution names.
 * - Short names (≤ 2 significant words): require near-exact match
 * - Medium names (3-4 words): require ALL significant words  
 * - Long names (5+ words): require ALL significant words
 */
function buildSearchRegex(name: string): RegExp | null {
    // Normalize: remove backticks, special chars
    const cleaned = name
        .replace(/`/g, "'")
        .replace(/[()&,.-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    // Extract significant keywords (3+ chars, excluding noise)
    const noiseWords = new Set(['the', 'of', 'and', 'for', 'in', 'at', 'to', 'a', 'an', 'its']);
    const keywords = cleaned
        .split(' ')
        .filter(w => w.length >= 3 && !noiseWords.has(w.toLowerCase()))
        .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (keywords.length === 0) return null;

    // For short names (1-2 keywords), use ALL keywords with word boundary-like matching
    // For longer names, require ALL significant keywords
    const parts = keywords.map(kw => `(?=.*${kw})`);
    return new RegExp(parts.join(''), 'i');
}

async function matchAndUpdateRankings(entries: NirfEntry[], category: string): Promise<{ matched: number; unmatched: string[] }> {
    let matched = 0;
    const unmatched: string[] = [];

    for (const entry of entries) {
        // Try exact match first (case-insensitive)
        const escapedName = entry.name.replace(/`/g, "'").replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        let college = await College.findOne({ name: { $regex: `^${escapedName}$`, $options: 'i' } });

        // If no exact match, try a "starts with" or "contains exact" match
        if (!college) {
            // Try: DB name starts with the NIRF name (handles trailing location info)
            college = await College.findOne({ name: { $regex: `^${escapedName}`, $options: 'i' } });
        }

        // If still no match, try the fuzzy regex but with ALL keywords
        if (!college) {
            const regex = buildSearchRegex(entry.name);
            if (regex) {
                // Find ALL matches and pick the best one (shortest name = most specific match)
                const candidates = await College.find({ name: regex }).limit(10);
                if (candidates.length > 0) {
                    // Score each candidate: prefer names closer in length to the search term
                    const nameLen = entry.name.length;
                    candidates.sort((a, b) => {
                        const aDiff = Math.abs(a.name.length - nameLen);
                        const bDiff = Math.abs(b.name.length - nameLen);
                        return aDiff - bDiff;
                    });

                    // Only accept if the best candidate is reasonably close in length
                    // (within 2x the original name length to avoid wild mismatches)
                    const best = candidates[0];
                    if (best.name.length <= nameLen * 2.5) {
                        college = best;
                    }
                }
            }
        }

        if (college) {
            // Only update if the new rank is better (lower) than existing, or no existing rank
            if (!college.nirfRank || entry.rank < college.nirfRank) {
                await College.updateOne(
                    { _id: college._id },
                    { $set: { nirfRank: entry.rank } }
                );
                console.log(`  ✅ [${category}] #${entry.rank}: "${entry.name}" → matched to "${college.name}"`);
            } else {
                console.log(`  ⏭️  [${category}] #${entry.rank}: "${entry.name}" → already has better rank #${college.nirfRank}`);
            }
            matched++;
        } else {
            unmatched.push(`#${entry.rank}: ${entry.name}`);
        }
    }

    return { matched, unmatched };
}

// ─── Main ───────────────────────────────────────────────────────────────────────

async function seedNirfRanks() {
    try {
        await connectDB();

        console.log('\n🏆 NIRF 2025 Rankings Seeder');
        console.log('═'.repeat(60));

        // First, clear all existing NIRF ranks to start fresh
        console.log('\n🗑️  Clearing existing NIRF ranks...');
        const cleared = await College.updateMany(
            { nirfRank: { $exists: true } },
            { $unset: { nirfRank: '' } }
        );
        console.log(`   Cleared nirfRank from ${cleared.modifiedCount} colleges`);

        const categories = [
            { name: 'Engineering', data: engineeringRankings },
            { name: 'Management', data: managementRankings },
            { name: 'Medical', data: medicalRankings },
            { name: 'Pharmacy', data: pharmacyRankings },
            { name: 'Law', data: lawRankings },
        ];

        let totalMatched = 0;
        const allUnmatched: string[] = [];

        for (const cat of categories) {
            console.log(`\n📊 Processing ${cat.name} Rankings (${cat.data.length} entries)...`);
            console.log('─'.repeat(50));

            const { matched, unmatched } = await matchAndUpdateRankings(cat.data, cat.name);
            totalMatched += matched;

            if (unmatched.length > 0) {
                console.log(`\n  ⚠️  Unmatched ${cat.name} institutions (${unmatched.length}):`);
                unmatched.forEach(u => console.log(`     ${u}`));
                allUnmatched.push(...unmatched.map(u => `[${cat.name}] ${u}`));
            }

            console.log(`\n  📈 ${cat.name}: ${matched}/${cat.data.length} matched`);
        }

        // Print summary
        console.log('\n' + '═'.repeat(60));
        console.log('📊 SUMMARY');
        console.log('═'.repeat(60));

        const totalEntries = categories.reduce((sum, c) => sum + c.data.length, 0);
        console.log(`Total NIRF entries: ${totalEntries}`);
        console.log(`Matched: ${totalMatched}`);
        console.log(`Unmatched: ${totalEntries - totalMatched}`);

        // Count how many colleges now have nirfRank
        const rankedCount = await College.countDocuments({ nirfRank: { $exists: true, $ne: null } });
        console.log(`\n📈 Total colleges in DB with NIRF rank: ${rankedCount}`);

        if (allUnmatched.length > 0) {
            console.log(`\n⚠️  ${allUnmatched.length} institutions could not be matched to DB.`);
            console.log('   These may need to be added to the database or matched manually.');
        }

        console.log('\n🎉 NIRF ranking seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding NIRF ranks:', error);
        process.exit(1);
    }
}

seedNirfRanks();
