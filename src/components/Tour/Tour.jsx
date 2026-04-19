import './Tour.css';

export default function HotelCard({ name, location, imageUrl, duration, price, dateFrom, dateTo }) {
  durationPrice = `${price} RUB / ${duration} дней`
  dates = `${dateFrom} - ${dateTo}`

  return (
    <div className="card">
      <img src={imageUrl} alt={name} className="image" />

      <div className="info">
        <div>
          <h3 className="title">{name}</h3>
          <p className="location">{location}</p>
        </div>

        <div className="bottomRow">
          <div className="badges">
            {badges.map((badge) => (
              <span key={badge} className="badge">
                {badge}
              </span>
            ))}
            <span className="duration">{durationPrice}</span>
          </div>

          <span className="price">{dates}</span>
        </div>
      </div>
    </div>
  );
}
