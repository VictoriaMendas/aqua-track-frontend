import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import css from './WaterForm.module.css';
import newSprite from '../../assets/newSprite.svg';

const AddWaterSchema = Yup.object({
  time: Yup.string()
    .required('Time is required')
    .matches(
      /^([0-9]|[01]\d|2[0-3]):([0-5]\d)$/,
      'Invalid time format (H:MM or HH:MM)',
    ),
  value: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .min(50, 'Minimum value is 50ml')
    .max(5000, 'Maximum value is 5000ml')
    .required('Value is required'),
});

const step = 50;

const currentTime = new Date().toLocaleTimeString([], {
  hour: 'numeric',
  minute: '2-digit',
});

const WaterForm = ({ value, date }) => {
  const dispatch = useDispatch();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(AddWaterSchema),
    defaultValues: {
      time: date ?? currentTime,
      value: value ?? 50,
    },
  });

  const onSubmit = async data => {
    try {
      dispatch(addWater(data));
    } catch (error) {
      alert('Failed to add water');
    }
  };

  const timeValue = watch('time') || currentTime;
  const waterValue = watch('value') ?? 50;

  const handlePlusClick = () => {
    const newValue = Math.min(Number(waterValue) + step, 5000);
    setValue('value', newValue);
  };

  const handleMinusClick = () => {
    const newValue = Math.max(Number(waterValue) - step, 50);
    setValue('value', newValue);
  };
  const displayWaterValue = Math.min(Number(waterValue), 5000);

  const handleValueChange = e => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      setValue('value', '', { shouldValidate: true });
    } else {
      let numValue = Number(inputValue);
      // if (numValue > 5000) {
      //   numValue = 5000;
      // }
      setValue('value', numValue, { shouldValidate: true });
    }
  };

  return (
    <div className={css.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={css.waterAmountContainer}>
          <label className={css.waterAmountLabel}>
            Amount of water:
            <div className={css.plusMinusContainer}>
              <button
                className={css.plusMinusBtn}
                type="button"
                onClick={handleMinusClick}
              >
                <svg className={css.plusMinusSvg} width={40} height={40}>
                  <use href={`${newSprite}#icon-minus`} />
                </svg>
              </button>
              <span className={css.waterAmount}>{displayWaterValue} ml</span>
              <button
                className={css.plusMinusBtn}
                type="button"
                onClick={handlePlusClick}
              >
                <svg className={css.plusMinusSvg} width={40} height={40}>
                  <use href={`${newSprite}#icon-plus`} />
                </svg>
              </button>
            </div>
          </label>
        </div>
        <div className={css.timeContainer}>
          <label className={css.timeLabel} htmlFor="time">
            Recording time:
            <input
              className={css.input}
              id="time"
              type="text"
              {...register('time')}
            />
          </label>
          {errors.time ? (
            <p className={css.errorMessage}>{errors.time.message}</p>
          ) : (
            <p className={`${css.errorMessage} ${css.hidden}`}> </p>
          )}
        </div>
        <div className={css.waterValueContainer}>
          <label className={css.waterValueLabel} htmlFor="value">
            Enter the value of the water used:
            <input
              className={css.input}
              id="value"
              type="number"
              {...register('value')}
              max="5000"
              value={waterValue}
              onChange={handleValueChange}
            />
          </label>
          {errors.value ? (
            <p className={css.errorMessage}>{errors.value.message}</p>
          ) : (
            <p className={`${css.errorMessage} ${css.hidden}`}> </p>
          )}
        </div>
        <button className={css.btn} type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default WaterForm;
