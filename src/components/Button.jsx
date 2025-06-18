import styles from './Button.module.css';

const Button = ({ children, onClick, disabled, type = 'button', variant = 'primary', ...rest }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.btn} ${styles[variant]}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button; 