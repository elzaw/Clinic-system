import { useScroll, useTransform, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const Examinations = () => {
  const params = useParams();

  useEffect(() => {
    console.log(location.pathname);
  }, []);
  const ref = useRef();

  const { scrollYProgress } = useScroll({ target: ref });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  return (
    <motion.div
      className="h-full"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}
    >
      <div>
        <div className="m-10 text-xl">
          <h1>ابحث عن الفحوصات بالتاريخ</h1>
          <input
            type="date"
            placeholder="اكتب اسم المريض أو رقم الهاتف"
            // value={searchQuery}
            // onChange={handleSearch}
            className="rounded border-gray-300 focus:border-blue-500 ring  focus:ring  focus:ring-blue-200 focus:ring-opacity-50 w-full p-2 m-5 "
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Examinations;
