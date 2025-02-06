import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderItem } from '../../types/Order';
import './RemarkModal.css';
interface RemarkModalProps {
  itemId: string;
  itemName: string;
  categories: string[];
  price: number;
  onClose: () => void;
  onSubmit: (orderItem: OrderItem) => void;
}

const RemarkModal = ({ itemId, itemName, categories, price, onClose, onSubmit }: RemarkModalProps) => {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [remarks, setRemarks] = useState({
    spiciness: '',
    seasoning: [] as string[],
    ingredients: [] as string[],
    customRemark: ''
  });

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, []);

  const handleSpiciness = (level: string) => {
    setRemarks(prev => ({ ...prev, spiciness: level }));
  };

  const handleToggleOption = (category: 'seasoning' | 'ingredients', option: string) => {
    setRemarks(prev => ({
      ...prev,
      [category]: prev[category].includes(option)
        ? prev[category].filter(item => item !== option)
        : [...prev[category], option]
    }));
  };

  const handleCustomRemarkChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRemarks(prev => ({
      ...prev,
      customRemark: e.target.value
    }));
  };

  const handleSubmit = () => {
    const orderItem: OrderItem = {
      id: null,
      menuItemId: itemId,
      title: itemName,
      price: price,
      quantity: 1,
      categories: categories,
      spiciness: remarks.spiciness,
      seasoning: remarks.seasoning,
      ingredients: remarks.ingredients,
      customRemark: remarks.customRemark,
      plated: false,
      delivered: false
    };
    onSubmit(orderItem);
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialogDimensions = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      onClose();
    }
  };

  return (
    <dialog ref={dialogRef} className="remark-modal" onClick={handleModalClick}>
      <div className="remark-content">
        <h4>{itemName + t('menuRemark.remarks')}</h4>

        <div className="remark-section">
          <h5>{t('menuRemark.spiciness')}</h5>
          <div className="remark-options">
            {['spicinessNone', 'spicinessMild', 'spicinessMedium', 'spicinessHot'].map(level => (
              <button
                key={level}
                className={`remark-section ${remarks.spiciness === t(`menuRemark.${level}`) ? 'selected' : ''}`}
                onClick={() => handleSpiciness(t(`menuRemark.${level}`))}
              >
                {t(`menuRemark.${level}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="remark-section">
          <h5>{t('menuRemark.seasoning')}</h5>
          <div className="remark-options">
            {[t('menuRemark.seasoningLessSalt'),
            t('menuRemark.seasoningMoreSalt'),
            t('menuRemark.seasoningLessSugar'),
            t('menuRemark.seasoningMoreSugar'),
            t('menuRemark.seasoningNoPepper'),
            t('menuRemark.seasoningLessPepper'),
            t('menuRemark.seasoningMorePepper'),
            t('menuRemark.seasoningLessSoySource'),
            t('menuRemark.seasoningMoreSoySource')].map(option => (
              <button
                key={option}
                className={remarks.seasoning.includes(option) ? 'selected' : ''}
                onClick={() => handleToggleOption('seasoning', option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="remark-section">
          <h5>{t('menuRemark.ingredients')}</h5>
          <div className="remark-options">
            {[t('menuRemark.ingredientsNoCoriander')].map(option => (
              <button
                key={option}
                className={remarks.ingredients.includes(option) ? 'selected' : ''}
                onClick={() => handleToggleOption('ingredients', option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="remark-section">
          <h5>{t('menuRemark.customRemark')}</h5>
          <textarea
            className="custom-remark-input"
            value={remarks.customRemark}
            onChange={handleCustomRemarkChange}
            placeholder={t('menuRemark.customRemarkPlaceholder')}
            rows={3}
          />
        </div>

        <button className="close-modal" onClick={handleSubmit}>
          {t('common.confirm')}
        </button>
      </div>
    </dialog>
  );
};

export default RemarkModal; 