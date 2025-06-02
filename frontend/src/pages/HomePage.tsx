import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const HomePage = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Mock data for demonstration
  const popularStations = [
    { id: '1', name: 'Gare Saint-Jean', bikes: 12, docks: 8 },
    { id: '2', name: 'Quinconces', bikes: 5, docks: 15 },
    { id: '3', name: 'Hôtel de Ville', bikes: 7, docks: 3 },
  ];
  
  const systemStats = {
    totalBikes: 1825,
    totalStations: 184,
    activeUsers: 12540,
    dailyRides: 4328
  };

  return (
    <div className="min-h-screen bg-white">
      {/* TBM-style breadcrumb */}
      <div className="bg-gray-100 py-2">
        <div className="tbm-container">
          <div className="text-sm text-gray-500">
            <span className="text-[#00b1eb]">Accueil</span> &gt; VCub
          </div>
        </div>
      </div>

      {/* Main Hero Banner */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://www.infotbm.com/sites/default/files/medias/images/2023-01/VELO_HEADER-min.jpg" 
            alt="Bordeaux cycling" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        </div>
        
        <div className="tbm-container relative z-10 flex flex-col justify-center h-full text-white">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-[#00b1eb]">VCub</span> Station Tracker
            </h1>
            <p className="text-xl mb-8">
              Trouvez des vélos disponibles dans les stations VCub à Bordeaux en temps réel.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/map"
                className="tbm-btn bg-[#00b1eb] hover:bg-[#0090c0] text-white px-8 py-3 rounded-full font-medium"
              >
                Voir la carte
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="tbm-btn border-2 border-white hover:bg-white/20 text-white px-8 py-3 rounded-full font-medium"
                >
                  Créer un compte
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Stats - TBM style floating panel */}
      <div className="relative z-20 -mt-16">
        <div className="tbm-container">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="flex flex-col items-center bg-[#00b1eb] text-white py-8 px-4">
                <span className="text-4xl font-bold mb-1">{systemStats.totalStations}</span>
                <span className="text-sm uppercase tracking-wider">Stations</span>
              </div>
              <div className="flex flex-col items-center bg-[#0090c0] text-white py-8 px-4">
                <span className="text-4xl font-bold mb-1">{systemStats.totalBikes}</span>
                <span className="text-sm uppercase tracking-wider">Vélos</span>
              </div>
              <div className="flex flex-col items-center bg-[#00b1eb] text-white py-8 px-4">
                <span className="text-4xl font-bold mb-1">{systemStats.activeUsers}</span>
                <span className="text-sm uppercase tracking-wider">Utilisateurs</span>
              </div>
              <div className="flex flex-col items-center bg-[#0090c0] text-white py-8 px-4">
                <span className="text-4xl font-bold mb-1">{systemStats.dailyRides}</span>
                <span className="text-sm uppercase tracking-wider">Trajets par jour</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Info - TBM style */}
      <div className="py-16 bg-white">
        <div className="tbm-container">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#333333]">
                Trouvez votre station
              </h2>
              <p className="text-gray-600 mb-6">
                Utilisez notre outil de recherche pour trouver la station VCub la plus proche avec des vélos disponibles.
              </p>
              
              <div className="bg-gray-100 p-6 rounded-xl shadow-sm">
                <div className="relative mb-4">
                  <input 
                    type="text" 
                    placeholder="Rechercher une station..." 
                    className="w-full border border-gray-300 rounded-full py-3 px-5 pl-12 focus:outline-none focus:ring-2 focus:ring-[#00b1eb]"
                  />
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <div className="flex gap-2">
                  <button className="bg-white border border-gray-300 rounded-full px-4 py-2 text-sm">Station ouverte</button>
                  <button className="bg-white border border-gray-300 rounded-full px-4 py-2 text-sm">Vélos disponibles</button>
                  <button className="bg-white border border-gray-300 rounded-full px-4 py-2 text-sm">E-bikes</button>
                </div>
              </div>
            </div>
            
            <div>
              <img 
                src="https://www.infotbm.com/sites/default/files/medias/images/2023-01/VCUB-PLUS.png" 
                alt="VCub+" 
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Popular Stations - TBM card style */}
      <div className="py-16 bg-gray-100">
        <div className="tbm-container">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-[#333333]">Stations populaires</h2>
            <Link to="/map" className="text-[#00b1eb] hover:underline flex items-center">
              Voir toutes les stations 
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {popularStations.map(station => (
              <div key={station.id} className="bg-white rounded-xl overflow-hidden shadow-md border-l-4 border-[#00b1eb] hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-[#00b1eb]">{station.name}</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">OUVERT</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#00b1eb]">{station.bikes}</div>
                      <div className="text-xs text-gray-500 uppercase">Vélos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#ff5c39]">2</div>
                      <div className="text-xs text-gray-500 uppercase">E-Bikes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-700">{station.docks}</div>
                      <div className="text-xs text-gray-500 uppercase">Places</div>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/stations/${station.id}`}
                    className="block w-full text-center py-3 bg-[#00b1eb] text-white rounded-lg hover:bg-[#0090c0] transition-colors"
                  >
                    Voir les détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* How to use VCub - TBM style */}
      <div className="py-16 bg-white">
        <div className="tbm-container">
          <h2 className="text-3xl font-bold text-center mb-16 text-[#333333]">Comment ça marche ?</h2>
          
          <div className="grid md:grid-cols-4 gap-10">
            <div className="text-center relative">
              <div className="w-20 h-20 bg-[#00b1eb] rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">1</div>
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-[#00b1eb]/20"></div>
              <h3 className="text-xl font-bold mb-2 text-[#333333]">Créez un compte</h3>
              <p className="text-gray-600">Inscrivez-vous gratuitement pour accéder à toutes les fonctionnalités</p>
            </div>
            
            <div className="text-center relative">
              <div className="w-20 h-20 bg-[#00b1eb] rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">2</div>
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-[#00b1eb]/20"></div>
              <h3 className="text-xl font-bold mb-2 text-[#333333]">Trouvez une station</h3>
              <p className="text-gray-600">Utilisez la carte pour localiser des vélos disponibles près de vous</p>
            </div>
            
            <div className="text-center relative">
              <div className="w-20 h-20 bg-[#00b1eb] rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">3</div>
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-[#00b1eb]/20"></div>
              <h3 className="text-xl font-bold mb-2 text-[#333333]">Enregistrez vos favoris</h3>
              <p className="text-gray-600">Marquez vos stations habituelles pour un accès rapide</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-[#00b1eb] rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">4</div>
              <h3 className="text-xl font-bold mb-2 text-[#333333]">Recevez des alertes</h3>
              <p className="text-gray-600">Obtenez des notifications sur la disponibilité des vélos</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tariffs - TBM style */}
      <div className="py-16 bg-gray-100">
        <div className="tbm-container">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#333333]">Nos offres</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:scale-105">
              <div className="bg-[#00b1eb] text-white p-6 text-center">
                <h3 className="text-2xl font-bold">Ticket 24h</h3>
                <div className="text-4xl font-bold mt-2">2€</div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#00b1eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Accès pendant 24h
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#00b1eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Trajets &lt; 30 min gratuits
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#00b1eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sans engagement
                  </li>
                </ul>
                <button className="mt-6 w-full py-3 bg-[#00b1eb] text-white rounded-lg hover:bg-[#0090c0]">
                  Choisir
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-xl border-2 border-[#00b1eb] transition-transform duration-300 hover:transform hover:scale-105 relative">
              <div className="absolute top-0 right-0 bg-[#ff5c39] text-white py-1 px-4 text-sm font-semibold">
                POPULAIRE
              </div>
              <div className="bg-[#00b1eb] text-white p-6 text-center">
                <h3 className="text-2xl font-bold">Abonnement Mensuel</h3>
                <div className="text-4xl font-bold mt-2">5€</div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#00b1eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Accès illimité pendant 1 mois
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#00b1eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Trajets &lt; 45 min gratuits
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#00b1eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sans engagement
                  </li>
                </ul>
                <button className="mt-6 w-full py-3 bg-[#00b1eb] text-white rounded-lg hover:bg-[#0090c0]">
                  Choisir
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:scale-105">
              <div className="bg-[#00b1eb] text-white p-6 text-center">
                <h3 className="text-2xl font-bold">Abonnement Annuel</h3>
                <div className="text-4xl font-bold mt-2">25€</div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#00b1eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Accès illimité pendant 1 an
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#00b1eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Trajets &lt; 60 min gratuits
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#00b1eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Vélos électriques inclus
                  </li>
                </ul>
                <button className="mt-6 w-full py-3 bg-[#00b1eb] text-white rounded-lg hover:bg-[#0090c0]">
                  Choisir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Download App CTA - TBM style */}
      <div className="py-16 bg-[#00b1eb]">
        <div className="tbm-container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 text-white">
              <h2 className="text-3xl font-bold mb-4">Téléchargez l'application</h2>
              <p className="text-xl mb-6">
                Emportez VCub Tracker avec vous. Téléchargez notre application mobile pour iOS et Android.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-[#00b1eb] px-6 py-3 rounded-full font-medium flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5649 12.3664C17.5077 10.2945 19.0002 9.0364 19.0717 8.9899C18.1167 7.6123 16.6087 7.4261 16.085 7.4026C14.8412 7.2661 13.6427 8.1538 13.0089 8.1538C12.3752 8.1538 11.3902 7.4198 10.3532 7.4454C9.0013 7.4709 7.7474 8.2611 7.0659 9.5264C5.6566 12.0989 6.7007 15.8693 8.0624 17.9147C8.7439 18.9113 9.5453 20.0314 10.5965 19.9932C11.6192 19.9549 12.0087 19.3309 13.239 19.3309C14.4693 19.3309 14.8305 19.9932 15.9006 19.9708C16.9946 19.9549 17.6903 18.9599 18.3577 17.9543C19.1449 16.8255 19.4718 15.71 19.4862 15.6639C19.4574 15.6547 17.6278 14.9226 17.5649 12.3664Z"/>
                    <path d="M15.7525 5.81893C16.3146 5.12388 16.6851 4.17367 16.5847 3.20007C15.7452 3.23822 14.6792 3.73682 14.0883 4.41927C13.5689 5.02118 13.1182 6.00771 13.2329 6.9538C14.184 7.03009 15.1617 6.51428 15.7525 5.81893Z"/>
                  </svg>
                  App Store
                </button>
                <button className="bg-white text-[#00b1eb] px-6 py-3 rounded-full font-medium flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.60012 20.4001C3.60012 20.9701 4.03012 21.4001 4.60012 21.4001H19.6001C20.1701 21.4001 20.6001 20.9701 20.6001 20.4001V5.40008H3.60012V20.4001ZM12.1001 10.4001C13.7001 10.4001 15.0001 11.6001 15.0001 13.2001C15.0001 14.8001 13.8001 16.1001 12.1001 16.1001C10.5001 16.1001 9.20012 14.9001 9.20012 13.2001C9.20012 11.6001 10.5001 10.4001 12.1001 10.4001ZM19.6001 2.40008H4.60012C4.03012 2.40008 3.60012 2.83008 3.60012 3.40008V4.40008H20.6001V3.40008C20.6001 2.83008 20.1701 2.40008 19.6001 2.40008Z"/>
                  </svg>
                  Google Play
                </button>
              </div>
            </div>
            <div className="md:w-1/3">
              <img 
                src="https://www.infotbm.com/sites/all/themes/tbm2019/images/mobile/visual-home.png" 
                alt="Mobile App" 
                className="max-w-full drop-shadow-2xl" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Latest News - TBM style */}
      <div className="py-16 bg-white">
        <div className="tbm-container">
          <h2 className="text-3xl font-bold mb-10 text-[#333333]">Actualités</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img 
                  src="https://www.infotbm.com/sites/default/files/medias/images/2022-09/ligne-D-tram.jpg" 
                  alt="Maintenance Update" 
                  className="w-full h-52 object-cover" 
                />
                <div className="absolute top-0 left-0 bg-[#00b1eb] text-white py-1 px-3 m-3 text-sm">
                  MAINTENANCE
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs text-gray-500">2 juin 2025</span>
                <h3 className="text-xl font-bold my-2 text-[#333333]">Maintenance à la station Hôtel de Ville</h3>
                <p className="text-gray-600 mb-4">La station Hôtel de Ville sera temporairement fermée pour maintenance du 5 au 7 juin.</p>
                <a href="#" className="text-[#00b1eb] font-medium hover:underline inline-flex items-center">
                  Lire plus
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img 
                  src="https://www.infotbm.com/sites/default/files/medias/images/2023-01/Reseau_BUS_0.jpg" 
                  alt="New Stations" 
                  className="w-full h-52 object-cover" 
                />
                <div className="absolute top-0 left-0 bg-[#ff5c39] text-white py-1 px-3 m-3 text-sm">
                  NOUVEAUTÉ
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs text-gray-500">28 mai 2025</span>
                <h3 className="text-xl font-bold my-2 text-[#333333]">Cinq nouvelles stations ajoutées</h3>
                <p className="text-gray-600 mb-4">Nous avons étendu notre réseau avec cinq nouvelles stations dans le quartier des Chartrons.</p>
                <a href="#" className="text-[#00b1eb] font-medium hover:underline inline-flex items-center">
                  Lire plus
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img 
                  src="https://www.infotbm.com/sites/default/files/medias/images/2021-10/TRAM%20BORDEAUX.jpg" 
                  alt="App Update" 
                  className="w-full h-52 object-cover" 
                />
                <div className="absolute top-0 left-0 bg-[#00b1eb] text-white py-1 px-3 m-3 text-sm">
                  APPLICATION
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs text-gray-500">15 mai 2025</span>
                <h3 className="text-xl font-bold my-2 text-[#333333]">Mise à jour de l'application : nouvelles fonctionnalités</h3>
                <p className="text-gray-600 mb-4">Notre dernière mise à jour inclut des indicateurs de niveau de batterie pour les vélos électriques.</p>
                <a href="#" className="text-[#00b1eb] font-medium hover:underline inline-flex items-center">
                  Lire plus
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;