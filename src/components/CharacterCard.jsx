import React from 'react';

export default function CharacterCard({
  char,
  data,
  taskSets,
  onToggle,
  onRemove,
  onMemoChange,
  onMoveUp,
  onMoveDown,
  onRemoveTask,
}) {
  const taskTypes = ['daily', 'weekly', 'monthly'];

  return (
    <div className="border rounded-xl p-4 shadow bg-white text-black dark:bg-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{char}</h2>
        <div className="flex gap-1">
          <button onClick={onMoveUp}>🔼</button>
          <button onClick={onMoveDown}>🔽</button>
          <button onClick={() => onRemove(char)} className="text-red-500">
            삭제
          </button>
        </div>
      </div>

      <textarea
        value={data.memo || ''}
        onChange={(e) => onMemoChange(char, e.target.value)}
        placeholder="메모 입력..."
        className="w-full border rounded p-2 mb-3 text-black"
      />

      {taskTypes.map((type) => (
        <div key={type} className="mb-2">
          <h3 className="font-semibold">
            {type === 'daily' && '📅 일일 숙제'}
            {type === 'weekly' && '📆 주간 숙제'}
            {type === 'monthly' && '📅 월간 숙제'}
          </h3>
          {taskSets[type]?.map((task) => (
            <div key={task} className="inline-flex items-center m-1">
              <button
                onClick={() => onToggle(char, type, task)}
                className={f"px-2 py-1 rounded border {'bg-green-500 text-white' if data[type]?.get(task) else 'bg-white text-black'}"}
              >
                {task}
              </button>
              <button
                className="text-xs ml-1 text-red-400"
                onClick={() => onRemoveTask(task, type)}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
