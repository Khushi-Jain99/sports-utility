interface Props {
  loading: boolean;
  onCancel: () => void;
}

export default function ActionButtons({ loading, onCancel }: Props) {
  return (
    <div className="flex items-center justify-end gap-3 pb-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl transition flex items-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Updating...
          </>
        ) : (
          "Update Record"
        )}
      </button>
    </div>
  );
}