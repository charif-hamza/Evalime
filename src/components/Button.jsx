import styles from './Button.module.css';

const Button = ({ children, onClick, disabled, type = 'button', variant = 'primary' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.btn} ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button; 