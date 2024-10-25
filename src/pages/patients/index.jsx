import instance from "@/data/instance";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { redirect, useNavigate } from "react-router-dom";

const Patients = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null); // Track the patient being edited

  const fetchData = async () => {
    try {
      const response = await instance.get("/patients");
      console.log("API Response:", response.data);
      setPatients(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery)
  );

  const handleAddClick = (e) => {
    e.stopPropagation();
    setShowForm(!showForm); // Show form when the Add button is clicked
    reset();
  };

  const handleEditClick = (patient) => {
    setEditingPatient(patient);
    setShowEditForm(true);
    setValue("name", patient.name);
    setValue("address", patient.address);
    setValue("phone", patient.phone);
  };

  // Function to handle adding a new patient
  const onSubmit = async (data) => {
    try {
      if (editingPatient) {
        // If we're editing, PATCH the patient data
        const response = await instance.patch(
          `/patients/${editingPatient._id}`,
          data
        );
        setPatients(
          patients.map((patient) =>
            patient._id === editingPatient._id ? response.data : patient
          )
        );
        setEditingPatient(null); // Clear the editing state after update
      } else {
        // If adding a new patient
        const response = await instance.post("/patients", data);
        setPatients([...patients, response.data]);
      }
      setShowForm(false);
      setShowEditForm(false); // Close the form after adding or updating
    } catch (err) {
      console.error("Error adding/updating patient:", err);
    }
  };

  const handleDelete = async (patientId) => {
    try {
      await instance.delete(`/patients/${patientId}`);
      setPatients(patients.filter((patient) => patient._id !== patientId));
    } catch (err) {
      console.error("Error deleting patient:", err);
    }
  };

  return (
    <div>
      <div className="m-10 text-xl">
        <h1>ابحث عن مريض</h1>
        <input
          type="search"
          placeholder="اكتب اسم المريض أو رقم الهاتف"
          value={searchQuery}
          onChange={handleSearch}
          className="rounded border-gray-300 focus:border-blue-500 ring  focus:ring  focus:ring-blue-200 focus:ring-opacity-50 w-full p-2 m-5 "
        />
      </div>

      {/* Add button to trigger form */}
      <div className="m-10">
        <Button
          className="text-blue-500 bg-transparent border border-blue-500 px-10 py-3 rounded hover:bg-blue-500 hover:text-white mx-3"
          onClick={handleAddClick}
        >
          ادخال مريض
        </Button>
      </div>

      {/* Form for adding a new patient */}
      {showForm && (
        <div className="fixed top-0 left-0 w-full min-h-screen bg-black bg-opacity-15 flex items-center justify-center z-20">
          <div className="bg-white p-5 border border-gray-300 rounded-lg shadow-lg w-[90%] md:w-[50%] relative z-30">
            <h2 className="text-2xl font-bold mb-4">إضافة مريض جديد</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-gray-700">اسم المريض</label>
                <input
                  type="text"
                  name="name"
                  {...register("name", { required: "الاسم مطلوب" })}
                  className="rounded border border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-2"
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">العنوان</label>
                <input
                  type="text"
                  name="address"
                  {...register("address", { required: "العنوان مطلوب" })}
                  className="rounded border border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-2"
                />
              </div>
              {errors.address && (
                <p className="text-red-500">{errors.address.message}</p>
              )}
              <div className="mb-4">
                <label className="block text-gray-700">الهاتف</label>
                <input
                  type="text"
                  name="phone"
                  {...register("phone", {
                    required: "الهاتف مطلوب",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "الهاتف يجب أن يكون رقما",
                    },
                  })}
                  className="rounded border border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-2"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500">{errors.phone.message}</p>
              )}
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

      <div className=" m-5 grid lg:grid-cols-3 grid-cols-1 ">
        {filteredPatients.map((patient) => (
          <div
            key={patient._id}
            className="bg-white dark:bg-gray-950 rounded shadow-lg p-6 border border-blue-300 cursor-pointer m-5  "
            onClick={() => navigate(`/patient/${patient._id}`)}
          >
            <h2 className="text-2xl font-bold mb-4 flex justify-center">
              معلومات الاتصال
            </h2>
            <div className="grid lg:grid-cols-1 grid-cols-1  gap-10 m-3 ">
              <div className="flex flex-col text-right items-center">
                <div className="">
                  <span className="text-gray-900 dark:text-gray-50 font-normal mr-2 my-2">
                    <UserIcon className="h-5 w-5 text-gray-500 inline" />
                    {patient?.name}
                  </span>
                </div>
                <div className="">
                  <span className="text-gray-900 dark:text-gray-50 mr-2 my-2">
                    <MapPinIcon className="h-5 w-5 text-red-500 inline m-2" />
                    {patient?.address}
                  </span>
                </div>
                <div className="">
                  <span className="text-gray-900 dark:text-gray-50 mr-2 my-2">
                    <PhoneIcon className="h-5 w-5 text-blue-500 inline mx-2" />
                    {patient?.phone}{" "}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-center ">
              <Button
                className="text-yellow-500 bg-transparent border border-yellow-500 px-10 py-3 rounded hover:bg-yellow-500 hover:text-white mx-3"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(patient);
                }}
              >
                تعديل
              </Button>

              {showEditForm && (
                <div
                  className="fixed top-0 left-0 w-full min-h-screen bg-black bg-opacity-15 flex items-center justify-center z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="bg-white p-5 border border-gray-300 rounded-lg shadow-lg w-[90%] md:w-[50%] relative z-30">
                    <h2 className="text-2xl font-bold mb-4">
                      تعديل بيانات مريض
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="mb-4">
                        <label className="block text-gray-700">
                          اسم المريض
                        </label>
                        <input
                          type="text"
                          name="name"
                          {...register("name", { required: "الاسم مطلوب" })}
                          className="rounded border border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-2"
                        />
                        {errors.name && (
                          <p className="text-red-500">{errors.name.message}</p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">العنوان</label>
                        <input
                          type="text"
                          name="address"
                          {...register("address", {
                            required: "العنوان مطلوب",
                          })}
                          className="rounded border border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-2"
                        />
                      </div>
                      {errors.address && (
                        <p className="text-red-500">{errors.address.message}</p>
                      )}
                      <div className="mb-4">
                        <label className="block text-gray-700">الهاتف</label>
                        <input
                          type="text"
                          name="phone"
                          {...register("phone", {
                            required: "الهاتف مطلوب",
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "الهاتف يجب أن يكون رقما",
                            },
                          })}
                          className="rounded border border-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-2"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500">{errors.phone.message}</p>
                      )}
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="text-white bg-blue-500 px-5 py-2 rounded mx-2"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          تعديل
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowEditForm(false);
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
                className="text-red-500 bg-transparent border border-red-500 px-10 py-3 rounded hover:bg-red-500 hover:text-white mx-3"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(patient._id, e);
                }}
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

export default Patients;

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
