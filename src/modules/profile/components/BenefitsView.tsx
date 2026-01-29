import { Gift, ShoppingBag, Coffee, Car, GraduationCap, Heart } from 'lucide-react';
import styles from './BenefitsView.module.scss';

interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: 'gift' | 'shopping' | 'coffee' | 'car' | 'education' | 'health';
  discount?: string;
  validUntil?: string;
}

export function BenefitsView(): JSX.Element {
  const benefits: Benefit[] = [
    {
      id: '1',
      title: 'Tankgutscheine',
      description: 'Monatlicher Tankzuschuss für Firmenwagen',
      icon: 'car',
      discount: '50€/Monat',
      validUntil: '31.12.2026'
    },
    {
      id: '2',
      title: 'Weiterbildung',
      description: 'Kostenlose Schulungen und Zertifizierungen',
      icon: 'education',
      validUntil: 'Dauerhaft'
    },
    {
      id: '3',
      title: 'Mitarbeiter-Rabatte',
      description: 'Vergünstigungen bei über 200 Partnern',
      icon: 'shopping',
      discount: 'Bis zu 30%'
    },
    {
      id: '4',
      title: 'Gesundheitsbonus',
      description: 'Zuschuss für Fitnessstudio und Vorsorge',
      icon: 'health',
      discount: '30€/Monat',
      validUntil: '31.12.2026'
    },
    {
      id: '5',
      title: 'Verpflegungsgutscheine',
      description: 'Gutscheine für Restaurants und Cafés',
      icon: 'coffee',
      discount: '8€/Tag',
      validUntil: '31.12.2026'
    },
    {
      id: '6',
      title: 'Geburtstags-Geschenk',
      description: 'Persönliches Geschenk zum Geburtstag',
      icon: 'gift',
      validUntil: 'Jährlich'
    }
  ];

  const getIcon = (iconType: Benefit['icon']) => {
    const props = { size: 24 };
    switch (iconType) {
      case 'gift': return <Gift {...props} />;
      case 'shopping': return <ShoppingBag {...props} />;
      case 'coffee': return <Coffee {...props} />;
      case 'car': return <Car {...props} />;
      case 'education': return <GraduationCap {...props} />;
      case 'health': return <Heart {...props} />;
      default: return <Gift {...props} />;
    }
  };

  return (
    <div className={styles.benefitsContainer}>
      <div className={styles.benefitsHeader}>
        <h2 className={styles.benefitsTitle}>Ihre Vorteile</h2>
        <p className={styles.benefitsSubtitle}>
          Nutzen Sie die Benefits für Mitarbeiter
        </p>
      </div>

      <div className={styles.benefitsList}>
        {benefits.map((benefit) => (
          <div key={benefit.id} className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              {getIcon(benefit.icon)}
            </div>
            <div className={styles.benefitContent}>
              <h3 className={styles.benefitTitle}>{benefit.title}</h3>
              <p className={styles.benefitDescription}>{benefit.description}</p>
              <div className={styles.benefitMeta}>
                {benefit.discount && (
                  <span className={styles.benefitDiscount}>{benefit.discount}</span>
                )}
                {benefit.validUntil && (
                  <span className={styles.benefitValidity}>Gültig bis: {benefit.validUntil}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
