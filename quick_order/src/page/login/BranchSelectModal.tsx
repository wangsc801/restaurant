import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {Branch} from '../types/branch';

interface BranchSelectModalProps {
  onClose: () => void;
  onSelect: (branch: Branch) => void;
}

const BranchSelectModal = ({ onClose, onSelect }: BranchSelectModalProps) => {
  const {t} = useTranslation();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/branch');
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
    fetchBranches();
  }, []);

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
    <dialog ref={dialogRef} className="branch-select-modal" onClick={handleModalClick}>
      <div className="modal-content">
        <h2>{t('login.selectBranch')}</h2>
        
        {isLoading ? (
          <div className="loading">{t('loading')}</div>
        ) : (
          <div className="branches-list">
            {branches.map((branch) => (
              <div 
                key={branch.code} 
                className="branch-item"
                onClick={() => onSelect(branch)}
              >
                <div className="branch-item-header">
                  <span className="branch-name">{branch.name}</span>
                  <span className="branch-code">#{branch.code}</span>
                </div>
                <div className="branch-address">{branch.address}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </dialog>
  );
};

export default BranchSelectModal; 