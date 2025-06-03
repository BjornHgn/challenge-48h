import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ratingService, StationRating as Rating } from '../../services/rating.service';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface StationRatingProps {
  stationId: string;
}

const StationRating: React.FC<StationRatingProps> = ({ stationId }) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  // Load station ratings
  useEffect(() => {
    const loadRatings = async () => {
      try {
        setLoading(true);
        const data = await ratingService.getStationRatings(stationId);
        setRatings(data);
        
        // If user is logged in, find their rating
        if (isAuthenticated && user) {
          const userRating = data.find((r: Rating) => r.user_id === user.id);
          if (userRating) {
            setUserRating(userRating.rating);
            setComment(userRating.comment || '');
          }
        }
      } catch (err: any) {
        console.error('Failed to load ratings:', err);
        setError('Unable to load ratings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadRatings();
  }, [stationId, isAuthenticated, user]);
  
  // Submit rating
  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('You must be logged in to rate stations');
      return;
    }
    
    try {
      setSubmitting(true);
      await ratingService.addRating(stationId, userRating, comment);
      
      // Refresh ratings
      const updatedRatings = await ratingService.getStationRatings(stationId);
      setRatings(updatedRatings);
      
      setError(null);
    } catch (err: any) {
      console.error('Failed to submit rating:', err);
      setError('Unable to submit rating. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Calculate average rating
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Évaluations de la station</h3>
      
      {/* Average rating display */}
      {ratings.length > 0 ? (
        <div className="flex items-center mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-yellow-400">
                {star <= Math.round(averageRating) ? (
                  <StarIcon className="h-5 w-5" />
                ) : (
                  <StarOutlineIcon className="h-5 w-5" />
                )}
              </span>
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {averageRating.toFixed(1)} sur {ratings.length} {ratings.length === 1 ? 'avis' : 'avis'}
          </span>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-4">Aucune évaluation pour le moment</p>
      )}
      
      {/* Rating form for authenticated users */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitRating} className="mb-6">
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">Votre évaluation</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  className="text-yellow-400"
                >
                  {star <= userRating ? (
                    <StarIcon className="h-6 w-6" />
                  ) : (
                    <StarOutlineIcon className="h-6 w-6" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="comment" className="block text-sm font-medium mb-2">Commentaire (optionnel)</label>
            <textarea
              id="comment"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="p-3 mb-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={submitting || userRating === 0}
            className="px-4 py-2 bg-primary-500 text-white rounded-md disabled:bg-gray-300"
          >
            {submitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 mb-4">
          Veuillez <a href="/login" className="text-primary-500 hover:underline">vous connecter</a> pour évaluer cette station.
        </p>
      )}
      
      {/* Display existing ratings */}
      <div className="space-y-4">
        <h4 className="font-medium">Avis récents</h4>
        
        {loading ? (
          <p className="text-sm text-gray-500">Chargement des avis...</p>
        ) : ratings.length > 0 ? (
          ratings.map((rating) => (
            <div key={rating._id} className="p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex text-yellow-400 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= rating.rating ? (
                          <StarIcon className="h-4 w-4" />
                        ) : (
                          <StarOutlineIcon className="h-4 w-4" />
                        )}
                      </span>
                    ))}
                  </div>
                  
                  {rating.comment && (
                    <p className="text-sm text-gray-700">{rating.comment}</p>
                  )}
                </div>
                
                <span className="text-xs text-gray-500">
                  {new Date(rating.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Pas encore d'avis. Soyez le premier à évaluer cette station !</p>
        )}
      </div>
    </div>
  );
};

export default StationRating;