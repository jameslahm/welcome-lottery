/**@jsx jsx */
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { useTransition, animated, config } from 'react-spring';
import shuffle from 'lodash/shuffle';
import { randomCandidates, parseCsv } from './util';
import { jsx, css } from '@emotion/core';
import { PrimaryButton } from './components/Button';

function App() {
	const timerContainer = useRef(null);
	const inputFileContainer = useRef(null);
	// const progressbarContainer = useRef(null);
	const [status, setStatus] = useState('PAUSE');
	const [currentRow, setCurrentRow] = useState(null);
	const [rows, setRows] = useState(randomCandidates());
	useEffect(() => {
		if (status === 'PAUSE') {
			if (timerContainer.current) {
				clearInterval(timerContainer.current);
			}
		} else {
			setRows(shuffle);
			timerContainer.current = setInterval(() => {
				setRows(shuffle);
			}, 2000);
		}
	}, [status]);
	let height = 0;
	const transitions = useTransition(
		rows.map((row) => {
			return {
				...row,
				y: (height += row.height) - row.height,
			};
		}),
		(d) => d.name,
		{
			from: ({ y, height }) => ({ height: 100, opacity: 0 }),
			leave: { opacity: 0 },
			enter: ({ y, height }) => ({ y, height, opacity: 1 }),
			update: ({ y, height }) => ({ y, height }),
			config: config.default,
			native: true,
		}
	);

	function updateProgress(percent) {
		console.log(`${percent * 7.7}rem`);
		// progressbarContainer.current.style.width = `${percent * 7.7}rem`;
	}

	return (
		<React.Fragment>
			<div
				css={css`
					position: relative;
					width: 70%;
					max-width: 600px;
				`}
				style={{ height }}
			>
				{transitions.map(
					({ item, props: { y, ...rest }, key }, index) => {
						return (
							<animated.div
								key={key}
								className="animatedDiv"
								style={{
									zIndex: index,
									transform: y.interpolate(
										(y) => `translateY(${y}px)`
									),
									...rest,
								}}
							>
								<div
									css={css`
										width: 100%;
										height: 100%;
										border-radius: 5px;
										box-shadow: 0px 10px 25px -10px rgba(0, 0, 0, 0.2);
										display: flex;
										justify-content: center;
										align-items: center;
										font-size: 1.2rem;
									`}
									style={{ backgroundImage: item.css }}
								>
									<h3>{item.name}</h3>
								</div>
							</animated.div>
						);
					}
				)}
			</div>
			<PrimaryButton
				css={css`
					position: fixed;
					right: 10rem;
					bottom: 5rem;
					z-index: 10000;
				`}
				onClick={() => {
					setStatus('START');
					setCurrentRow(null);
				}}
			>
				Start
			</PrimaryButton>
			<PrimaryButton
				css={css`
					position: fixed;
					right: 3.5rem;
					bottom: 5rem;
					z-index: 10000;
				`}
				onClick={() => {
					setStatus('PAUSE');
					if (timerContainer.current) {
						const randNum = Math.floor(Math.random() * rows.length);
						setCurrentRow(rows[randNum] ? rows[randNum] : null);
						rows.splice(randNum, 1);
						const newRows = [...rows];
						setRows(newRows);
					}
				}}
			>
				Pause
			</PrimaryButton>
			{timerContainer.current && status === 'PAUSE' ? (
				<div
					css={css`
						height: ${2 * (currentRow ? currentRow.height : 100)}px;
						position: fixed;
						border-radius: 5px;
						box-shadow: 0px 10px 25px -10px rgba(0, 0, 0, 0.2);
						display: flex;
						max-width: 1200px;
						justify-content: center;
						align-items: center;
						font-size: 1.9rem;
						flex: 1;
						margin-top: 25vh;
						width: 100%;
						z-index: 20000;
					`}
					style={{
						backgroundImage: currentRow
							? currentRow.css
							: 'linear-gradient(#fff,#fff)',
					}}
				>
					<h3>{currentRow ? currentRow.name : 'Finished'}</h3>
				</div>
			) : // </div>
			null}

			<PrimaryButton
				css={css`
					position: fixed;
					right: 4rem;
					top: 20rem;
					z-index: 10000;
				`}
				onClick={() => {
					setRows([]);
					setRows(randomCandidates());
				}}
			>
				Random Generate
			</PrimaryButton>
			<PrimaryButton
				css={css`
					position: fixed;
					right: 4rem;
					top: 24rem;
					z-index: 10000;
				`}
				onClick={() => {
					setRows([]);
				}}
			>
				Clear
			</PrimaryButton>
			<PrimaryButton
				css={css`
					position: fixed;
					right: 4rem;
					top: 16rem;
					z-index: 10000;
				`}
				onClick={() => {
					inputFileContainer.current.click();
				}}
			>
				Import CSV
				<input
					type="file"
					css={css`
						display: none;
					`}
					ref={inputFileContainer}
					accept=".csv"
					onChange={async (event) => {
						const files = event.target.files;
						setRows(await parseCsv(files[0], updateProgress));
						inputFileContainer.current.value=""
						// progressbarContainer.current.style.width = 0;
					}}
				></input>
			</PrimaryButton>
			{/* <Button
				css={css`
					position: fixed;
					right: 4rem;
					top: 20rem;
					z-index: 10000;
					width:0;
					padding-left:0;
					padding-right:0;
					background-color:red;
				`}

				ref={progressbarContainer}
			></Button> */}
		</React.Fragment>
	);
}

export default App;
