import { use, useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import TourCard from "../../components/Tour/Tour";
import "./ToursPage.css";

const TOURS = [
  {
    id: 1,
    name: "Золотые пляжи Анталии",
    direction: "Турция, Анталья",
    description: "Отель 5* с a;fkvnkfjvnskfjvn lfkjvnsdlfkvn efjvn owihbo hwoghocrughcnowriucghorithmbcirbhcnpsigcbnwieb vwoihcnwioehbpwet bwiyth hbiwh iwvhn sfvwfowihncowgithucgniwhnvciofhxpivfpivmuefhmicsvufhmoviu\gftvhnosdfigvhsoifdvoimсистемой «всё включено». Собственный песчаный пляж, 5 бассейнов, аквапарк и спа-центр.",
    image: "https://images.unsplash.com/photo-1614687154593-c9e5c3e1b8e0?w=400&h=300&fit=crop",
    price: 125000,
    duration: 7,
    dateFrom: "15.06.2025",
    dateTo: "22.06.2025",
    isTransferExists: true,
    isInsurancesExists: true,
  },
  {
    id: 2,
    name: "Кемер - райский уголок",
    direction: "Турция, Кемер",
    description: "Уютный отель в окружении соснового леса. Идеально для семейного отдыха. Детский клуб и анимация.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
    price: 98500,
    duration: 8,
    dateFrom: "20.07.2025",
    dateTo: "28.07.2025",
    isTransferExists: true,
    isInsurancesExists: false,
  },
  {
    id: 3,
    name: "Лазурный берег Ниццы",
    direction: "Франция, Ницца",
    description: "Роскошный отель с видом на Средиземное море. Гастрономические ужины от шеф-повара, бассейн с подогревом.",
    image: "https://images.unsplash.com/photo-1570809814305-c909f6b71139?w=400&h=300&fit=crop",
    price: 245000,
    duration: 6,
    dateFrom: "05.08.2025",
    dateTo: "11.08.2025",
    isTransferExists: false,
    isInsurancesExists: true,
  },
  {
    id: 4,
    name: "Египетское солнце",
    direction: "Египет, Хургада",
    description: "Популярный отель с коралловым пляжем. Отличный дайвинг, анимация и восточная кухня.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    price: 87500,
    duration: 10,
    dateFrom: "01.09.2025",
    dateTo: "11.09.2025",
    isTransferExists: true,
    isInsurancesExists: true,
  },
  {
    id: 5,
    name: "Бали - остров богов",
    direction: "Индонезия, Бали",
    description: "Виллы среди рисовых террас. Йога, медитации, спа-процедуры и вегетарианское меню.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop",
    price: 189000,
    duration: 9,
    dateFrom: "10.10.2025",
    dateTo: "19.10.2025",
    isTransferExists: true,
    isInsurancesExists: true
  },
  {
    id: 6,
    name: "Горные склоны Сочи",
    direction: "Россия, Сочи",
    description: "Отель у подножия Кавказских гор. Идеально для активного отдыха: пешие туры, велопрогулки.",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop",
    price: 76000,
    duration: 5,
    dateFrom: "25.08.2025",
    dateTo: "30.08.2025",
    isTransferExists: true,
    isInsurancesExists: true
  }
];

export default function ToursPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const reservationProcess = location.state?.reservationProcess;

  const clients = [
  {
    id: 1,
    clientName: "Гальцова Елизавета Игоревна",
    email: "ssss"
  },]
  
  const filteredTours = useMemo(() => {
    if (!search.trim()) {
      return TOURS;
    }
    
    return TOURS.filter(tour => 
      tour.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleTourClick = (tour) => {
    if (reservationProcess) {
      navigate("/reservations/create", { state: { tour } });
    } else {
      navigate(`/tours/${tour.id}`);
    }
  }

  return (
    <div className="tours-selection">

      <div className="tours-container">
        {/* Left Sidebar — Preferences */}
        <aside className="sidebar">
          <div className="client-info-card">
            <h2 className="client-info-title">
              Информация о клиенте
            </h2>

            <div className="client-info-content">
              <div>
                <p className="info-label">
                  Клиент
                </p>
                <p className="info-value">
                  {/*CLIENT.name*/ "ппупупу"}
                </p>
              </div>
              <div className="divider" />
              <div>
                <p className="info-label">
                  Предпочтения
                </p>
                <p className="preferences-text">
                  {/*CLIENT.preferences*/ "жляои жялври жзвгшпр зцшкг ерпызшегуп иышзва зымшвапмиф зшапм выаярлмятамимидвоармиылдамиядварлдмоирм"}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <div>
            <h1 className="page-title">
              Подбор туров
            </h1>
            <p className="page-subtitle">
              Выберите подходящий тур для клиента
            </p>

            <div className="tours-list">
              {/*onClick={() => handleTourClick(tour)}
              className={`tour-card ${selectedTour === tour.id ? "selected" : ""}`}/>*/}
              {TOURS.map((tour) => (
                <TourCard 
                  key={tour.id} 
                  tour={tour} />
                  
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}