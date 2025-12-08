import Image from "next/image";
import Link from "next/link";

const About = () => {
  const contributors = [
    {
      image: "https://avatars.githubusercontent.com/u/17052350?v=4",
      name: "Julian",
      link: "https://github.com/julchu/",
    },
    {
      image: "https://avatars.githubusercontent.com/u/8752461?v=4",
      name: "Eugene",
      link: "https://github.com/eugenern/",
    },
  ];

  return (
    <div className="flex h-full flex-col items-center bg-gray-200 md:flex-col">
      Contributors
      <div className="flex flex-col justify-center md:flex-row">
        {contributors.map(({ name, image, link }, index) => {
          return (
            <ContributorCard
              key={`${name}_${index}`}
              img={image}
              name={name}
              link={link}
            />
          );
        })}
      </div>
    </div>
  );
};

type ContributorCardProps = {
  img: string;
  name: string;
  link: string;
};

const ContributorCard = ({ img, name, link }: ContributorCardProps) => {
  return (
    <Link href={link}>
      <Image src={img} alt={`${name}`} width={100} height={100} />
      {name}
    </Link>
  );
};

export default About;