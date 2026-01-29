import { useState } from 'react';
import { Search, Play, Clock, Award, BookOpen } from 'lucide-react';
import { TopBar } from '../../profile/components/TopBar';
import styles from './InfosView.module.scss';

type InfoTab = 'videos' | 'tests' | 'lerneinheiten' | 'wiki' | 'avatar';
type FilterType = 'alle' | 'angefangen' | 'abgeschlossen';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  tags: ('mandatory' | 'skills')[];
  progress?: number;
  points?: number;
}

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Verkehrssicherung Grundlagen',
    thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
    duration: '12:34',
    tags: ['mandatory'],
    progress: 45,
    points: 100,
  },
  {
    id: '2',
    title: 'Halteverbotzonen richtig aufstellen',
    thumbnail: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d',
    duration: '18:22',
    tags: ['skills'],
    progress: 100,
    points: 150,
  },
  {
    id: '3',
    title: 'Excel für Monteure - Beginner\'s Guide',
    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b',
    duration: '25:15',
    tags: ['skills'],
    progress: 0,
    points: 200,
  },
];

export function InfosView(): JSX.Element {
  const [activeTab, setActiveTab] = useState<InfoTab>('videos');
  const [activeFilter, setActiveFilter] = useState<FilterType>('alle');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = mockVideos.filter((video) => {
    // Filter nach Titel
    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Filter nach Status
    let matchesFilter = true;
    if (activeFilter === 'angefangen') {
      matchesFilter = video.progress !== undefined && video.progress > 0 && video.progress < 100;
    } else if (activeFilter === 'abgeschlossen') {
      matchesFilter = video.progress === 100;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className={styles.infosView}>
      <TopBar onLogout={() => console.log('Logout')} />
      <div className={styles.header}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Videos durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === 'videos' ? styles.tabActive : ''
            }`}
            onClick={() => setActiveTab('videos')}
          >
            Videos
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === 'tests' ? styles.tabActive : ''
            }`}
            onClick={() => setActiveTab('tests')}
          >
            Tests
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === 'lerneinheiten' ? styles.tabActive : ''
            }`}
            onClick={() => setActiveTab('lerneinheiten')}
          >
            Lerneinheiten
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === 'wiki' ? styles.tabActive : ''
            }`}
            onClick={() => setActiveTab('wiki')}
          >
            Wiki
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === 'avatar' ? styles.tabActive : ''
            }`}
            onClick={() => setActiveTab('avatar')}
          >
            Avatar
          </button>
        </div>
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.filterButton} ${
            activeFilter === 'alle' ? styles.filterButtonActive : ''
          }`}
          onClick={() => setActiveFilter('alle')}
        >
          Alle
        </button>
        <button
          className={`${styles.filterButton} ${
            activeFilter === 'angefangen' ? styles.filterButtonActive : ''
          }`}
          onClick={() => setActiveFilter('angefangen')}
        >
          Angefangen
        </button>
        <button
          className={`${styles.filterButton} ${
            activeFilter === 'abgeschlossen' ? styles.filterButtonActive : ''
          }`}
          onClick={() => setActiveFilter('abgeschlossen')}
        >
          Abgeschlossen
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.videoGrid}>
          {filteredVideos.map((video) => (
            <div key={video.id} className={styles.videoCard}>
              <div className={styles.thumbnail}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className={styles.thumbnailImage}
                />
                <div className={styles.playButton}>
                  <Play size={24} fill="white" />
                </div>
              </div>

              <div className={styles.videoInfo}>
                <div className={styles.videoTags}>
                  {video.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`${styles.tag} ${
                        tag === 'mandatory'
                          ? styles.tagMandatory
                          : styles.tagSkills
                      }`}
                    >
                      {tag === 'mandatory' ? 'Mandatory' : 'Skills'}
                    </span>
                  ))}
                </div>

                <h3 className={styles.videoTitle}>{video.title}</h3>

                <div className={styles.videoMeta}>
                  <span className={styles.metaItem}>
                    <Clock size={14} />
                    {video.duration}
                  </span>
                  {video.points && (
                    <span className={styles.metaItem}>
                      <Award size={14} />
                      {video.points} Punkte
                    </span>
                  )}
                </div>

                {video.progress !== undefined && video.progress > 0 && (
                  <div className={styles.progress}>
                    <div
                      className={styles.progressBar}
                      style={{ width: `${video.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}