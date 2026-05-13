import { useParams, Navigate } from 'react-router-dom';
import Properties from './Properties';
import { getRegionFromSlug } from '../utils/slugify';

export default function LocalityPage() {
  const { regionSlug } = useParams();
  const regionName = getRegionFromSlug(regionSlug);

  if (!regionName) {
    return <Navigate to="/properties" replace />;
  }

  return <Properties regionOverride={regionName} />;
}
