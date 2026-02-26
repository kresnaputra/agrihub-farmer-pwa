export default function WeatherAlert() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-2xl mr-3">🌧️</span>
          <div>
            <div className="font-bold">Curah Hujan Tinggi</div>
            <div className="text-sm opacity-90">Prediksi 3 hari ke depan</div>
          </div>
        </div>
        <span className="text-xl">→</span>
      </div>
      <div className="text-sm opacity-90">
        Siapkan drainage, panen bisa dipercepat 2-3 hari. Waspada banjir di area rendah.
      </div>
      <div className="mt-3 flex items-center text-xs opacity-80">
        <span className="mr-4">📊 Sumber: BMKG</span>
        <span>⏰ Update: 2 jam lalu</span>
      </div>
    </div>
  );
}