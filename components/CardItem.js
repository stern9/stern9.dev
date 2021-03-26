import Link from "next/link";
import Image from "next/image";

const CardItem = ({ image, alt, header, previewURL, codeURL, description }) => {
  return (
    <div className="overflow-hidden transition-shadow duration-300 bg-white rounded shadow-lg">
      <Link href={previewURL}>
        <a target="_blank" rel="noreferrer">
          <Image src={image} alt={alt} width="600" height="500" />
        </a>
      </Link>
      <div className="p-5 border-t-0">
        <p className="mb-3 text-xs font-semibold tracking-wide uppercase">
          <span className="text-secondary">{header}</span>
        </p>
        <div className="my-4">
          <div className="flex justify-around">
            <button className="bg-primary dark:bg-secondary hover:bg-secondary dark:hover:bg-primary text-white border font-bold py-2 px-4 rounded ml-4 shadow">
              <Link href={previewURL}>
                <a target="_blank" rel="noreferrer" className="">
                  Preview
                </a>
              </Link>
            </button>
            <button className="bg-primary dark:bg-secondary hover:bg-secondary dark:hover:bg-primary text-white border font-bold py-2 px-4 rounded ml-4 shadow">
              <Link href={codeURL}>
                <a target="_blank" rel="noreferrer" className="">
                  Code
                </a>
              </Link>
            </button>
          </div>
        </div>
        <p className="mb-4 text-primary md:text-sm">{description}</p>
      </div>
    </div>
  );
};

export default CardItem;
