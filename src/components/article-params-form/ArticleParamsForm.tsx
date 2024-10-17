import React, { useReducer, useRef, useEffect, useState } from 'react';
import { Button } from 'components/button';
import { ArrowButton } from 'components/arrow-button';
import { Text } from '../text';
import clsx from 'clsx';
import styles from './ArticleParamsForm.module.scss';
import { OnClick } from '../arrow-button/ArrowButton';
import { Select } from '../select';
import { RadioGroup } from '../radio-group';
import { Separator } from '../separator';
import {
	backgroundColors,
	contentWidthArr,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
	defaultArticleState,
	ArticleStateType,
	OptionType,
} from 'src/constants/articleProps';

interface UpdateFieldAction {
	type: 'UPDATE_FIELD';
	field: keyof ArticleStateType;
	value: OptionType;
}

interface ResetFormAction {
	type: 'RESET_FORM';
}

type FormActions = UpdateFieldAction | ResetFormAction;

// Редьюсер для управления параметрами формы
function formReducer(
	state: ArticleStateType,
	action: FormActions
): ArticleStateType {
	switch (action.type) {
		case 'UPDATE_FIELD':
			return { ...state, [action.field]: action.value };
		case 'RESET_FORM':
			return defaultArticleState;
		default:
			throw new Error('Unknown action');
	}
}

type FormProps = {
	stateSubmit: (value: ArticleStateType) => void;
	stateReset: () => void;
};

export const ArticleParamsForm = ({ stateSubmit, stateReset }: FormProps) => {
	const [formState, dispatch] = useReducer(formReducer, defaultArticleState);
	const [formVisibility, setFormVisibility] = useState(false); // Состояние для видимости формы
	const formRef = useRef<HTMLDivElement>(null);

	// Функция для переключения видимости формы
	const toggleFormVisibility: OnClick = () => {
		setFormVisibility(!formVisibility);
	};

	// Функция для обновления полей формы
	const handleFieldChange =
		(field: keyof ArticleStateType) => (value: OptionType) => {
			dispatch({ type: 'UPDATE_FIELD', field, value });
		};

	// Функция для сброса формы
	const resetForm = () => {
		dispatch({ type: 'RESET_FORM' });
		stateReset();
	};

	// Функция для отправки формы
	const submitForm = (event: React.FormEvent) => {
		event.preventDefault();
		stateSubmit(formState);
	};

	// Закрытие формы при клике вне её
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (formRef.current && !formRef.current.contains(e.target as Node)) {
				setFormVisibility(false);
			}
		};

		if (formVisibility) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [formVisibility]);

	return (
		<>
			<ArrowButton visibility={formVisibility} onClick={toggleFormVisibility} />
			<div
				className={clsx(styles.container, {
					[styles.container_open]: formVisibility,
				})}
				ref={formRef}>
				<form className={styles.form} onSubmit={submitForm}>
					<Text as='h2' size={31} weight={800} uppercase dynamicLite>
						задайте параметры
					</Text>
					<Select
						title='шрифт'
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={handleFieldChange('fontFamilyOption')}
					/>
					<RadioGroup
						name='размер шрифта'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						title='размер шрифта'
						onChange={handleFieldChange('fontSizeOption')}
					/>
					<Select
						title='цвет шрифта'
						selected={formState.fontColor}
						options={fontColors}
						onChange={handleFieldChange('fontColor')}
					/>
					<Separator />
					<Select
						title='цвет фона'
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={handleFieldChange('backgroundColor')}
					/>
					<Select
						title='ширина контента'
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={handleFieldChange('contentWidth')}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' type='reset' onClick={resetForm} />
						<Button title='Применить' type='submit' />
					</div>
				</form>
			</div>
		</>
	);
};
