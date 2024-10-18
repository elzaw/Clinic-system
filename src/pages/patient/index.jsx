import api from "@/data/instance";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Patient = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const { id } = useParams(); // Extract the patient ID from the URL
  const [patient, setPatient] = useState("");
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error status
  const navigate = useNavigate(); // For navigation
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [examinations, setExaminations] = useState(null);

  // Fetch patient data based on the provided ID
  const fetchData = async () => {
    setLoading(true);
    try {
      const [patientRes, examsRes] = await Promise.all([
        api.get(`/patients/${id}`),
        api.get(`/examinations/patient/${id}/`),
      ]);
      setPatient(patientRes.data);
      setExaminations(examsRes.data);
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate("/patients");
  };

  const fetchExaminaions = async () => {
    try {
      const response = await api.get(`examinations/patient/${id}/`);
      setExaminations(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingExam) {
        // Update existing exam

        await api.patch(`/examinations/${editingExam._id}`, {
          ...data,
          patient: id,
        });
        setExaminations((prevExams) =>
          prevExams.map((exam) =>
            exam._id === editingExam._id ? { ...exam, ...data } : exam
          )
        );
        toast.success("تم تعديل الفحص بنجاح!");
      } else {
        // Add new exam
        const response = await api.post(`/examinations/`, {
          ...data,
          patient: id,
        });
        setExaminations([...examinations, response.data]);
        toast.success("تمت إضافة الفحص بنجاح!");
      }
      // Close the form
      setShowForm(false);
      setShowEditForm(false);
      setEditingExam(null);
      // Reset form values
    } catch (err) {
      console.error("Error submitting examination data:", err);
      toast.error("خطأ في البيانات");
    }
    reset();
  };

  const handleDelete = async (examId) => {
    try {
      await api.delete(`examinations/${examId}`);
      setExaminations((prevExaminations) => {
        return prevExaminations?.filter((exam) => exam._id !== examId);
      });
      toast.success("تم الحذف");
    } catch (error) {
      console.error("Error deleting examination:", error);
    }
  };

  const handleEditClick = (exam) => {
    setEditingExam(exam);
    setShowEditForm(true);
    setValue("action", exam.action);
    setValue("date", exam.date?.split("T")[0]); // Ensure date format is YYYY-MM-DD
    setValue("notes", exam.notes);
    setValue("nextVisit", exam.nextVisit?.split("T")[0]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString("ar-EG"); // Adjust the locale based on your preference
  };
  return (
    <div>
      {/* Patient information */}
      <div className="bg-white dark:bg-gray-950 rounded shadow-lg p-6 lg:m-20 m-8 border border-[#000080] ">
        <h2 className="text-2xl font-bold mb-4 text-right">معلومات الاتصال</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <span className="text-gray-900 dark:text-gray-50 font-medium mr-2">
            <UserIcon className="inline text-gray-500 mx-2" />
            {patient?.name}
          </span>

          <span className="text-gray-900 dark:text-gray-50 mr-2">
            <MapPinIcon className="inline text-red-500 mx-2" />
            {patient?.address}
          </span>

          <span className="text-gray-900 dark:text-gray-50 mr-2">
            <PhoneIcon className="inline text-blue-500 mx-2" />
            {patient?.phone}
          </span>
        </div>
      </div>

      {/* Medical History and Examinations */}
      <div>
        <div className="text-center">
          <Button
            onClick={() => {
              setShowForm(!showForm);
            }}
            className="bg-blue-500 text-white text-center  px-4 rounded hover:bg-blue-600 "
          >
            {" "}
            {showForm ? "إغلاق النموذج" : "إضافة فحص جديد"}
          </Button>
        </div>

        {showForm && (
          <div className="fixed top-0 left-0 w-full min-h-screen bg-black bg-opacity-15 flex items-center justify-center z-20">
            <div className="bg-white p-5 border border-gray-300 rounded-lg shadow-lg w-[50%] relative z-30">
              <h2 className="text-2xl font-bold mb-4">إضافة فحص جديد</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className="block text-gray-700">الاجراء</label>
                  <input
                    type="text"
                    name="action"
                    {...register("action", { required: "الاجراء مطلوب" })}
                    className="rounded border border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-2"
                  />
                  {errors.action && (
                    <p className="text-red-500">{errors.action.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">تاريخ الكشف</label>
                  <input
                    type="date"
                    name="date"
                    {...register("date", { required: "تاريخ الكشف مطلوب" })}
                    className="rounded border border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-2"
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500">{errors.date.message}</p>
                )}
                <div className="mb-4">
                  <label className="block text-gray-700">تاريخ المتابعة</label>
                  <input
                    type="date"
                    name="nextVisit"
                    {...register("nextVisit")}
                    className="rounded border border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-2"
                  />
                </div>
                {errors.nextVisit && (
                  <p className="text-red-500">{errors.nextVisit.message}</p>
                )}

                <div className="mb-4">
                  <label className="block text-gray-700">ملاحظات</label>
                  <textarea
                    name="notes"
                    {...register("notes")}
                    className="rounded border border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-2"
                  />
                  {errors.notes && (
                    <p className="text-red-500">{errors.notes.message}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="text-white bg-blue-500 px-5 py-2 rounded mx-2"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    إضافة
                  </Button>
                  <Button
                    onClick={() => setShowForm(false)}
                    className="text-white bg-red-500 px-5 py-2 rounded mx-2"
                  >
                    غلق النموذج
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      {/* Display all examinations */}
      <div className="py-10 text-xl">
        <h2 className="text-2xl font-bold  text-right mr-10">الفحوصات</h2>
        {examinations?.map((exam, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-950 rounded shadow-lg p-6 border border-[#000080] m-5"
          >
            {/* Display examination details */}
            <div>
              <span className="text-gray-900 dark:text-gray-50 mr-2">
                رسوم الفحص: {exam.examinationFee}
              </span>
              {/* <PhoneIcon className="h-5 w-5 text-gray-500" /> */}
            </div>
            <div>
              <span className="text-gray-900 dark:text-gray-50 mr-2">
                المبلغ المدفوع: {exam.paid}
              </span>
              {/* <PhoneIcon className="h-5 w-5 text-gray-500" /> */}
            </div>
            <div>
              <span className="text-gray-900 dark:text-gray-50 mr-2">
                المبلغ المتبقي: {exam.remaining}
              </span>
              {/* <PhoneIcon className="h-5 w-5 text-gray-500" /> */}
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
            {/* Edit/Update buttons */}
            <div className="flex flex-col md:flex-row justify-center mt-4">
              <Button
                className="text-[#000080] bg-transparent border border-yellow-500 md:px-48 px-10 py-3 rounded hover:bg-yellow-500 hover:text-white md:mx-5"
                onClick={() => handleEditClick(exam)}
              >
                تعديل
              </Button>

              {showEditForm && (
                <div className="fixed top-0 left-0 w-full min-h-screen bg-black bg-opacity-15 flex items-center justify-center z-20">
                  <div className="bg-white p-5 border border-gray-300 rounded-lg shadow-lg w-[90%] md:w-[50%] relative z-30">
                    <h2 className="text-2xl font-bold mb-4">
                      تعديل بيانات فحص
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="mb-4">
                        <label className="block text-gray-700">الاجراء</label>
                        <input
                          type="text"
                          name="action"
                          {...register("action", { required: "الاجراء مطلوب" })}
                          className="rounded border border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-2"
                        />
                        {errors.action && (
                          <p className="text-red-500">
                            {errors.action.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">
                          تاريخ الكشف
                        </label>
                        <input
                          type="date"
                          name="date"
                          {...register("date", {
                            required: "تاريخ الكشف مطلوب",
                          })}
                          className="rounded border border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-2"
                        />
                      </div>
                      {errors.date && (
                        <p className="text-red-500">{errors.date.message}</p>
                      )}
                      <div className="mb-4">
                        <label className="block text-gray-700">
                          تاريخ المتابعة
                        </label>
                        <input
                          type="date"
                          name="nextVisit"
                          {...register("nextVisit")}
                          className="rounded border border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-2"
                        />
                      </div>
                      {errors.nextVisit && (
                        <p className="text-red-500">
                          {errors.nextVisit.message}
                        </p>
                      )}

                      <div className="mb-4">
                        <label className="block text-gray-700">ملاحظات</label>
                        <textarea
                          name="notes"
                          {...register("notes")}
                          className="rounded border border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-2"
                        />
                        {errors.notes && (
                          <p className="text-red-500">{errors.notes.message}</p>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="text-white bg-yellow-500 px-5 py-2 rounded mx-2"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          تعديل
                        </Button>
                        <Button
                          onClick={() => {
                            setShowEditForm(false);
                            setEditingExam(null); // Clear editing exam
                            reset();
                          }}
                          className="text-white bg-red-500 px-5 py-2 rounded mx-2"
                        >
                          غلق النموذج
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              <Button
                className="text-red-500 bg-transparent border border-red-500 md:px-48 px-10 py-3 rounded hover:bg-red-500 hover:text-white mt-4 md:mt-0"
                onClick={() => handleDelete(exam._id)}
              >
                حذف
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Patient;

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
