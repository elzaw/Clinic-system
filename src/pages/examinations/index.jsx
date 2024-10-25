import { Button } from "@/components/ui/button";
import instance from "@/data/instance";
import { useScroll, useTransform, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

const Examinations = () => {
  const { register, handleSubmit, reset } = useForm(); // React Hook Form setup
  const params = useParams();
  const [examinations, setExaminations] = useState([]); // Store fetched examinations
  const [loading, setLoading] = useState(false); // Loading state
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  useEffect(() => {
    console.log(location.pathname);
  }, []);

  // Function to handle form submission
  const onSubmit = async (data) => {
    const { date } = data;

    if (date) {
      setLoading(true);
      try {
        // Fetch examinations for the selected date
        const response = await instance.get(
          `/examinations/by-date?date=${date}`
        );

        setExaminations(response.data);
        console.log(examinations);
      } catch (error) {
        console.error("Error fetching examinations:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    } else {
      setExaminations([]); // Clear examinations if no date is selected
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString("ar-EG"); // Adjust the locale based on your preference
  };

  return (
    <motion.div
      className="h-full"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}
    >
      <div className="m-10 text-xl ">
        <h1>ابحث عن الفحوصات بالتاريخ</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <input
            type="date"
            {...register("date")}
            className="rounded border-gray-300 focus:border-blue-500 ring focus:ring focus:ring-blue-200 focus:ring-opacity-50 w-full p-2 m-5 "
          />
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded w-1/6 "
            >
              ابحث
            </button>
          </div>
        </form>

        <div className="py-10 text-xl">
          <h2 className="text-2xl font-bold text-right mr-10">الفحوصات</h2>
          {loading ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500 mx-auto"></div>
              <h2 className="text-zinc-900 dark:text-white mt-4">
                {" "}
                انتظر رجاء...
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                سوف يتم تحميل البيانات
              </p>
            </div>
          ) : examinations.length === 0 ? (
            <p className="text-center">
              لا يوجد فحوصات في هذا اليوم أو اختر يومًا محددًا
            </p> // No examinations message
          ) : (
            examinations.map((exam, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-950 rounded shadow-lg p-6 border border-[#000080] m-5"
              >
                {/* Display examination details */}
                <div>
                  <span className="text-gray-900 dark:text-gray-50 mr-2">
                    رسوم الفحص: {exam.examinationFee}
                  </span>
                </div>
                <div>
                  <span className="text-gray-900 dark:text-gray-50 mr-2">
                    المبلغ المدفوع: {exam.paid}
                  </span>
                </div>
                <div>
                  <span className="text-gray-900 dark:text-gray-50 mr-2">
                    المبلغ المتبقي: {exam.remaining}
                  </span>
                </div>
                <div>
                  <span className="text-gray-900 dark:text-gray-50 mr-2">
                    الإجراء: {exam.action}
                  </span>
                </div>
                <div>
                  <span className="text-gray-900 dark:text-gray-50 mr-2">
                    ملاحظات: {exam.notes === "" ? "لا يوجد" : exam.notes}{" "}
                  </span>
                </div>
                <div>
                  <span className="text-gray-900 dark:text-gray-50 mr-2">
                    تاريخ الكشف: {formatDate(exam.date)}{" "}
                  </span>
                </div>
                <div>
                  <span className="text-gray-900 dark:text-gray-50 mr-2">
                    موعد الزيارة القادمة:{" "}
                    {exam.nextVisit ? formatDate(exam.nextVisit) : "لا يوجد"}
                  </span>
                </div>
                <div className="bg-white dark:bg-gray-950 rounded shadow-lg p-6 lg:m-2 m-8 border border-[#000080] ">
                  <h2 className="text-2xl font-bold mb-4 text-right">
                    معلومات الاتصال
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <span className="text-gray-900 dark:text-gray-50 font-medium mr-2">
                      <UserIcon className="inline text-gray-500 mx-2" />
                      {exam.patient?.name}
                    </span>

                    <span className="text-gray-900 dark:text-gray-50 mr-2">
                      <MapPinIcon className="inline text-red-500 mx-2" />
                      {exam.patient?.address}
                    </span>

                    <span className="text-gray-900 dark:text-gray-50 mr-2">
                      <PhoneIcon className="inline text-blue-500 mx-2" />
                      {exam.patient?.phone}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Examinations;

function MapPinIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
