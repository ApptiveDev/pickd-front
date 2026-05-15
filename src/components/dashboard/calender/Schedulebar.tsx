const Schedulebar = () => {
  return (
    <aside className="w-60 border-r border-gray-200 bg-white p-5 hidden lg:flex flex-col gap-8">
      {/* 로고 영역 */}
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-xl text-blue-600">Pickd</h2>
      </div>

      {/* 일정 보기 설정 섹션 */}
      <section>
        <p className="text-xs font-bold text-gray-400 mb-4 tracking-tight">일정 보기 설정</p>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
            <span className="text-gray-700">💼 채용 공고 일정</span>
          </label>
          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-purple-600" />
            <span className="text-gray-700">👤 개인 일정</span>
          </label>
          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-green-600" />
            <span className="text-gray-700">✅ To-do</span>
          </label>
        </div>
      </section>
    </aside>
  );
};

export default Schedulebar;