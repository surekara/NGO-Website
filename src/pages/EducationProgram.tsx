import ProgramDetail from "../components/ProgramDetail";

const galleryImages = [
  { src: "/education-1.png", caption: "Value-Based Education Seminar" },
  { src: "/education-2.png", caption: "Certificate Distribution" },
  { src: "/education-3.png", caption: "Group Discussions" },
  { src: "/education-4.png", caption: "Interactive Learning Sessions" },
  { src: "/education-5.png", caption: "Youth Empowerment Seminars" },
  { src: "/education-6.png", caption: "Student Engagement Programs" },
];

const EducationProgram = () => (
  <ProgramDetail
    title="EDUCATION"
    heroImage="/education-hero.png"
    description={'Our youth empowerment program focuses on imparting human value-based education inspired by Vedic wisdom. By instilling positive values and life skills, we aim to steer young minds away from negative influences and empower them to become leaders for tomorrow'}
    gallery={galleryImages}
    ribbon={["Values","Life Skills","Vedic Wisdom","Leadership","Youth Empowerment","Character"]}
  />
);

export default EducationProgram;
