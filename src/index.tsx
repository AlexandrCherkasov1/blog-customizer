import { createRoot } from 'react-dom/client';
import { StrictMode, CSSProperties, useState } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import {
	defaultArticleState,
	ArticleStateType,
} from './constants/articleProps';

import styles from './styles/index.module.scss';
import './styles/index.scss';

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

const App = () => {
	// Состояние для хранения текущих параметров статьи
	const [articleState, setArticleState] =
		useState<ArticleStateType>(defaultArticleState);

	// Обработчик применения новых параметров
	const handleApply = (newState: ArticleStateType) => {
		setArticleState(newState);
	};

	// Обработчик сброса параметров к значениям по умолчанию
	const handleReset = () => {
		setArticleState(defaultArticleState);
	};

	return (
		<div
			className={clsx(styles.main)}
			style={
				{
					// Применение параметров через CSS-переменные
					'--font-family': articleState.fontFamilyOption.value,
					'--font-size': articleState.fontSizeOption.value,
					'--font-color': articleState.fontColor.value,
					'--container-width': articleState.contentWidth.value,
					'--bg-color': articleState.backgroundColor.value,
				} as CSSProperties
			}>
			<ArticleParamsForm stateSubmit={handleApply} stateReset={handleReset} />
			<Article />
		</div>
	);
};

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
