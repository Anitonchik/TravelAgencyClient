import './Hotel.css';

export default function HotelCard({hotel}) {
  durationPrice = `${hotel.price} RUB / ${hotel.durationOfStay} дней`
  dates = `${hotel.DateFrom} - ${hotel.DateTo}`

  return (
    <div className="card">
      <img src={hotel.imageUrl} alt={hotel.name} className="image" />

      <div className="info">
        <div>
          <h3 className="title">{hotel.name}</h3>
          <p className="location">{hotel.location}</p>
        </div>

        <div className="bottomRow">
          <span key={badge} className="badge">
            {hotel.foodType}
          </span>
          
          <span className="price">{price}</span>
        </div>
      </div>
    </div>
  );
}
