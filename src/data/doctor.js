import doctorImage from '../assets/doctor-dheekshith-mr.jpeg';
export const DOCTOR_PROFILE = {
  name: 'Dr. Dheekshith MR',
  title: 'Orthopaedic Surgeon',
  degrees: 'MBBS, MS, DNB (Ortho)',
  specialty: 'Orthopaedic Surgery & Musculoskeletal Care',
  subSpecialties: [
    'Joint Replacement',
    'Sports & Football Injuries',
    'Fracture & Trauma Care',
    'Arthritis & Joint Pain',
    'Knee & Hip Conditions',
    'Shoulder & Upper Limb Problems'
  ],
  experienceYears: 7,
  image: doctorImage,
  clinic: {
    name: '',
    suite: '',
    address: '',
    city: '',
    phone: '7022108860',
    phoneUrl: 'tel:+917022108860',
    directLine: '7022108860',
    whatsapp: '7022108860',
    whatsappUrl: 'https://wa.me/917022108860',
    email: 'dheekshithmrnikhi@gmail.com',
    emailUrl: 'mailto:dheekshithmrnikhi@gmail.com',
    instagram: 'dhee_ortho_care',
    instagramUrl: 'https://www.instagram.com/dhee_ortho_care/',
    hours: []
  },
  consultationOptions: [
    {
      id: 'telehealth',
      title: 'Online Consultation',
      subtitle: 'Remote consultation via video or messaging',
      duration: '20 – 30 mins',
      features: [
        'Discuss symptoms and orthopaedic concerns remotely',
        'Review X-rays, MRI, or prior reports shared digitally',
        'Expert opinion and general guidance provided',
        'Ideal for second opinions and follow-up queries'
      ],
      recommendedFor: 'Second opinions, follow-up consultations, injury assessment queries & travel-constrained patients'
    },
    {
      id: 'in-clinic',
      title: 'In-Clinic Consultation',
      subtitle: 'In-person evaluation',
      duration: '30 – 45 mins',
      features: [
        'Comprehensive physical and orthopaedic examination',
        'On-site assessment of joints, bones, and mobility',
        'Personalised management and treatment plan',
        'Direct referral for imaging or physiotherapy if required'
      ],
      recommendedFor: 'New patients, acute injuries, joint pain evaluation, and pre/post-surgical consultations'
    }
  ],
  bio: {
    intro: 'Dr. Dheekshith MR is an Orthopaedic Surgeon with a strong academic background and clinical training in orthopaedic surgery. He holds an MBBS, MS in Orthopaedics, and a DNB in Orthopaedics, along with a Fellowship in Joint Replacement and a Diploma in Football Medicine (FIFA). His training equips him to evaluate and manage a broad range of musculoskeletal conditions, including joint replacement needs, sports injuries, fractures, and general orthopaedic concerns.',
    philosophy: 'I believe in providing clear, evidence-based guidance to each patient — helping them understand their condition and make informed decisions about their musculoskeletal health and recovery.',
    quote: 'Good orthopaedic care begins with listening carefully to the patient and understanding their goals for recovery and mobility.'
  },
  education: [
    {
      degree: 'Diploma in Football Medicine (FIFA)',
      institution: 'FIFA – Fédération Internationale de Football Association',
      years: 'Completed'
    },
    {
      degree: 'Fellowship in Joint Replacement',
      institution: 'Fellowship Training Programme',
      years: 'Completed'
    },
    {
      degree: 'DNB (Orthopaedics)',
      institution: 'National Board of Examinations',
      years: 'Completed'
    },
    {
      degree: 'MS (Orthopaedics)',
      institution: 'Post-Graduate Medical Education',
      years: 'Completed'
    },
    {
      degree: 'MBBS',
      institution: 'Medical College',
      years: 'Completed'
    }
  ],
  certifications: [
    'MBBS – Bachelor of Medicine, Bachelor of Surgery',
    'MS (Orthopaedics) – Master of Surgery in Orthopaedics',
    'DNB (Orthopaedics) – Diplomate of National Board',
    'Fellowship in Joint Replacement',
    'Diploma in Football Medicine – FIFA'
  ],
  affiliations: [
    'Orthopaedic Surgeon – available for in-clinic & online consultations',
    'Specialised training in joint replacement surgery',
    'FIFA-certified Diploma in Football Medicine'
  ],
  services: [
    {
      id: 'acl-injury-reconstruction',
      title: 'ACL Injury & Reconstruction',
      icon: 'Zap',
      description: 'Expert arthroscopic reconstruction for ACL tears, aiming to restore stability and function to the knee for active individuals and athletes.',
      points: ['Arthroscopic ACL repair', 'Graft selection guidance', 'Structured rehab protocols']
    },
    {
      id: 'knee-arthroscopy',
      title: 'Knee Arthroscopy',
      icon: 'Activity',
      description: 'Minimally invasive diagnostic and therapeutic procedures for various knee joint issues, offering faster recovery times.',
      points: ['Minimally invasive approach', 'Faster recovery', 'Diagnostic accuracy']
    },
    {
      id: 'meniscus-treatment',
      title: 'Meniscus Injury & Treatment',
      icon: 'ShieldCheck',
      description: 'Specialised care for meniscus tears, providing arthroscopic repair or partial meniscectomy to preserve joint health.',
      points: ['Arthroscopic repair', 'Meniscectomy when needed', 'Joint preservation']
    },
    {
      id: 'knee-replacement',
      title: 'Knee Replacement',
      icon: 'Activity',
      description: 'Advanced total and partial knee replacement surgeries designed to relieve chronic arthritis pain and restore mobility.',
      points: ['Total & partial replacements', 'Advanced implants', 'Comprehensive post-op care']
    },
    {
      id: 'hip-replacement',
      title: 'Hip Replacement',
      icon: 'Activity',
      description: 'Surgical solutions for severe hip arthritis and fractures using modern prostheses for improved joint mechanics.',
      points: ['Arthritis management', 'Hip fracture solutions', 'Enhanced mobility']
    },
    {
      id: 'shoulder-rotator-cuff',
      title: 'Shoulder & Rotator Cuff Care',
      icon: 'Sparkles',
      description: 'Comprehensive surgical and non-surgical treatment for rotator cuff tears, impingement, and shoulder instability.',
      points: ['Rotator cuff repair', 'Instability management', 'Mobility restoration']
    },
    {
      id: 'sports-medicine',
      title: 'Sports Medicine & Injuries',
      icon: 'Zap',
      description: 'Dedicated sports medicine care focusing on the rapid and safe return to athletic activities following an injury.',
      points: ['Athletic injury assessment', 'FIFA-certified expertise', 'Safe return-to-sport']
    },
    {
      id: 'orthopaedic-trauma',
      title: 'Orthopaedic Trauma & Fracture',
      icon: 'ShieldCheck',
      description: 'Urgent and definitive care for simple to complex fractures using advanced casting and surgical fixation techniques.',
      points: ['Complex fracture fixation', 'Urgent trauma care', 'Optimal bone healing']
    },
    {
      id: 'ligament-tendon-injuries',
      title: 'Ligament & Tendon Injuries',
      icon: 'Stethoscope',
      description: 'Targeted treatment for sprains, strains, and tendon ruptures across all major joints.',
      points: ['Soft tissue healing', 'Tendon repair', 'Sprain management']
    },
    {
      id: 'general-orthopaedic',
      title: 'General Orthopaedic Care',
      icon: 'HeartPulse',
      description: 'Comprehensive evaluation and personalized treatment plans for a broad spectrum of musculoskeletal complaints.',
      points: ['Diagnostic imaging review', 'Personalised treatment', 'Preventative care']
    }
  ],
  treatments: [
    { id: 'knee-pain', title: 'Knee Pain', icon: 'Stethoscope', description: 'Comprehensive evaluation for acute or chronic knee pain.', points: [] },
    { id: 'arthritis-joint-pain', title: 'Arthritis & Joint Pain', icon: 'HeartPulse', description: 'Management of osteoarthritis and inflammatory joint conditions.', points: [] },
    { id: 'acl-tears', title: 'ACL Tears', icon: 'Zap', description: 'Diagnosis and management of anterior cruciate ligament injuries.', points: [] },
    { id: 'meniscus-tears', title: 'Meniscus Tears', icon: 'Activity', description: 'Treatment plans for symptomatic meniscal cartilage damage.', points: [] },
    { id: 'shoulder-pain', title: 'Shoulder Pain', icon: 'Stethoscope', description: 'Care for general shoulder discomfort and stiffness.', points: [] },
    { id: 'frozen-shoulder', title: 'Frozen Shoulder', icon: 'Activity', description: 'Therapies to improve range of motion in adhesive capsulitis.', points: [] },
    { id: 'rotator-cuff-problems', title: 'Rotator Cuff Problems', icon: 'Sparkles', description: 'Management of tendonitis and cuff weakness.', points: [] },
    { id: 'hip-pain', title: 'Hip Pain', icon: 'Stethoscope', description: 'Evaluation of hip joint discomfort, bursitis, and arthritis.', points: [] },
    { id: 'sports-football-injuries', title: 'Sports & Football Injuries', icon: 'Zap', description: 'Specialized care for football-related musculoskeletal issues.', points: [] },
    { id: 'fractures-trauma', title: 'Fractures & Trauma', icon: 'ShieldCheck', description: 'Initial and follow-up care for bone breaks and trauma.', points: [] },
    { id: 'ligament-injuries', title: 'Ligament Injuries', icon: 'Stethoscope', description: 'Care for sprains and partial tears of joint ligaments.', points: [] },
    { id: 'tendon-injuries', title: 'Tendon Injuries', icon: 'Activity', description: 'Treatment for Achilles, patellar, and other tendinopathies.', points: [] },
    { id: 'foot-heel-ankle', title: 'Foot, Heel & Ankle Problems', icon: 'Stethoscope', description: 'Management of plantar fasciitis, ankle sprains, and heel pain.', points: [] },
    { id: 'back-neck-pain', title: 'Back & Neck Pain', icon: 'Activity', description: 'Initial assessment and conservative care for spinal pain.', points: [] },
    { id: 'spine-care', title: 'Spine Care', icon: 'Activity', description: 'Care for common spinal conditions and discomfort.', points: [] },
    { id: 'sciatica', title: 'Sciatica', icon: 'Activity', description: 'Assessment and treatment of sciatic nerve pain.', points: [] },
    { id: 'childrens-orthopaedic', title: 'Children\'s Orthopaedic Conditions', icon: 'HeartPulse', description: 'Evaluation of pediatric growth-related musculoskeletal concerns.', points: [] },
    { id: 'musculoskeletal-problems', title: 'Musculoskeletal Problems', icon: 'ShieldCheck', description: 'Broad-spectrum care for muscle, bone, and joint disorders.', points: [] }
  ],
  regenerativeTreatments: [
    {
      id: 'prp-therapy',
      title: 'PRP Therapy',
      icon: 'HeartPulse',
      description: 'Platelet-Rich Plasma therapy utilizes your body’s own natural healing factors to accelerate recovery for tendon injuries and mild arthritis.',
      points: ['Natural healing mechanism', 'Minimally invasive', 'Outpatient procedure']
    },
    {
      id: 'gfc-therapy',
      title: 'GFC Therapy',
      icon: 'Zap',
      description: 'Growth Factor Concentrate therapy offers a refined, highly concentrated dose of your own growth factors for enhanced tissue repair.',
      points: ['Highly concentrated formula', 'Targeted tissue repair', 'Advanced regenerative care']
    },
    {
      id: 'hyaluronic-acid',
      title: 'Hyaluronic Acid / Viscosupplementation',
      icon: 'Activity',
      description: 'Provides lubrication and shock absorption to arthritic joints, reducing pain and improving mobility without surgery.',
      points: ['Improved joint lubrication', 'Pain reduction', 'Enhanced mobility']
    },
    {
      id: 'ultrasound-guided',
      title: 'Ultrasound-Guided Injections',
      icon: 'Stethoscope',
      description: 'Real-time imaging ensures that orthopaedic injections are delivered precisely to the affected joint or tendon for maximum efficacy.',
      points: ['High precision delivery', 'Increased safety', 'Maximized clinical benefit']
    },
    {
      id: 'non-surgical-knee',
      title: 'Non-surgical Knee Pain Management',
      icon: 'ShieldCheck',
      description: 'A comprehensive conservative approach to knee pain, combining medication, bracing, and structured physical therapy.',
      points: ['Conservative approach', 'Pain management strategies', 'Lifestyle modification']
    },
    {
      id: 'sports-injury-rehab',
      title: 'Sports Injury Rehabilitation',
      icon: 'Sparkles',
      description: 'Customized rehabilitation programs designed to restore strength, flexibility, and function following sports injuries.',
      points: ['Customized rehab plans', 'Strength & flexibility focus', 'Functional recovery']
    }
  ],
  locations: [
    {
      id: 'ramanagara',
      name: 'Ramanagara',
      hospital: 'Atreum Ramakrishna Hospital',
      address: 'SS Complex, BM Road, near IDBI Bank, Vivekananda Nagar',
      city: 'Ramanagara, Karnataka 562159',
      mapQuery: 'Atreum Ramakrishna Hospital, SS Complex, BM Road, near IDBI Bank, Vivekananda Nagar, Ramanagara, Karnataka 562159'
    },
    {
      id: 'rr-nagar',
      name: 'RR Nagar, Bengaluru',
      hospital: 'Atreum Specialty Hospital',
      address: 'Ideal Homes Layout, Kenchenahalli, Rajarajeshwari Nagar',
      city: 'Bengaluru, Karnataka 560098',
      mapQuery: 'Atreum Specialty Hospital, Ideal Homes Layout, Kenchenahalli, Rajarajeshwari Nagar, Bengaluru, Karnataka 560098'
    }
  ],
  testimonials: []
};
