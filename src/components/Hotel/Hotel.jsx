import './Hotel.css';

export default function HotelCard({hotel, selected, onSelect}) {
  console.log("Данные отеля:", hotel);
  const durationPrice = `${hotel.price} RUB / ${hotel.durationOfStay} дней`
  const dates = `${hotel.DateFrom} - ${hotel.DateTo}`

   const getFoodTypeText = (foodType) => {
    const foodTypes = {
      'RO': 'Без питания (RO)',
      'BB': 'Завтрак (BB)',
      'HB': 'Полупансион (HB) - завтрак и ужин',
      'FB': 'Полный пансион (FB) - завтрак, обед, ужин',
      'AI': 'Всё включено (AI)',
    };
    return foodTypes[foodType] || foodType || 'Питание не указано';
  };

  return (
    <button 
    onClick={onSelect}
    className={`hotel-card ${selected ? "hotel-card-selected" : "hotel-card-default"}`}
    >
      <img src={hotel.imageUrl} alt={hotel.name} className="image" />

      <div className="info">
        <div>
          <h3 className="title">{hotel.name}</h3>
          <p className="location">{hotel.location}</p>
        </div>

        <div className="bottomRow">
          <span key={hotel.id} className="badge">
            {getFoodTypeText(hotel.foodType)}
          </span>
          
          <span className="price">{durationPrice}</span>
        </div>
      </div>
    </button>
  );
}
