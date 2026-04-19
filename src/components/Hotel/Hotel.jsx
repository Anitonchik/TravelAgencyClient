import './Hotel.css';

export default function HotelCard({ name, location, imageUrl, badges, price }) {
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
          </div>

          <span className="price">{price}</span>
        </div>
      </div>
    </div>
  );
}
