const Examinations = () => {
  return (
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
  );
};

export default Examinations;
