<script lang="ts">
	import type { ChatCompletion } from 'openai/resources/chat';
	import Map from '../lib/components/Map.svelte';
	import { mapStore } from '../stores/map';
	import { addAIAnswerToMap } from '../lib/util/map';
	import TypingDots from '../lib/components/TypingDots.svelte';

	let message = '';

	type Question = {
		type: 'QUESTION';
		ts: Date;
		question: string;
	};

	type Answer = {
		type: 'ANSWER';
		ts: Date;
		choices: ChatCompletion['choices'];
	};

	type ChatEntry = Question | Answer;

	let chatHistory: ChatEntry[];
	$: chatHistory = [];

	let loading: boolean;

	const onSubmit = async () => {
		chatHistory = [
			...chatHistory,
			{
				type: 'QUESTION',
				ts: new Date(),
				question: message
			}
		];
		loading = true;
		const response = await fetch('/api/chat', {
			method: 'POST',
			body: JSON.stringify({ message }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const completion = (await response.json()) as ChatCompletion;
		loading = false;

		const geojsonAnswer = completion.choices?.[0].message?.content;
		if (geojsonAnswer) {
			addAIAnswerToMap(JSON.parse(geojsonAnswer), $mapStore);
		}

		chatHistory = [
			...chatHistory,
			{
				type: 'ANSWER',
				ts: new Date(),
				choices: completion.choices
			}
		];
	};

	const choiceToText = (choice: ChatCompletion.Choice) => {
		if (choice?.message?.content) {
			return JSON.parse(choice?.message?.content).text;
		}
		return 'Response contains no "text".';
	};
</script>

<div class="main">
	<header class="header">ARDA AI</header>
	<div class="chat-container">
		<div class="chat-history">
			{#each chatHistory as chatEntry}
				{#if chatEntry.type === 'QUESTION'}
					<div class="chat-question">
						{chatEntry.question}
					</div>
				{:else}
					<div class="chat-answer">
						{#each chatEntry.choices as choice}
							<div class="chat-answer-choice">
								{choiceToText(choice)}
							</div>
						{/each}
					</div>
				{/if}
			{/each}
			{#if loading}
				<div class="awaiting-answer">
					<TypingDots />
				</div>
			{/if}
		</div>
		<div class="chat-prompt">
			<textarea
				name="message"
				bind:value={message}
				on:keydown={(e) => {
					if (e.key === 'Enter') onSubmit();
				}}
			/>
			<button class="button" on:click={onSubmit}>
				<i class="material-icons">send</i>
			</button>
		</div>
	</div>
	<div class="map-container">
		<Map />
	</div>
	<footer class="footer" />
</div>

<style lang="less">
	:global(body),
	.main {
		width: 100vw;
		height: 100vh;
		margin: 0;
	}

	.main {
		display: grid;
		grid-template-areas:
			'header header'
			'chat map'
			'footer footer';
		grid-template-rows: 3em 1fr 1.5em;
		grid-template-columns: 1fr 3fr;
	}

	header {
		grid-area: header;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 10px gainsboro;
		z-index: 1;
	}
	.chat-container {
		grid-area: chat;
		display: flex;
		flex-direction: column;
		.chat-history {
			flex: 1;
			display: flex;
			flex-direction: column;

			.chat-question,
			.chat-answer,
			.awaiting-answer {
				margin: 0.25em;
				max-width: 90%;
				padding: 0.25em;
				border-radius: 0.25em;
			}

			.chat-question {
				align-self: flex-start;
				background-color: rgb(208, 253, 238);
			}

			.chat-answer,
			.awaiting-answer {
				align-self: flex-end;
				background-color: rgb(255, 202, 183);
			}
		}
		.chat-prompt {
			display: flex;

			textarea {
				resize: none;
				flex: 1;
				font-size: 1.25em;
				line-height: 1.25em;
				padding: 0.5em;
				border-width: 1px;
				border-radius: 0;
				&:focus-visible {
					border-radius: 0;
				}
			}

			.button {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				padding: 10px 20px;
				background-color: #3498db;
				color: #ffffff;
				border: none;
				cursor: pointer;
				transition: background-color 0.3s ease;
			}

			.button:hover {
				background-color: #2980b9;
			}
		}
	}
	.map-container {
		grid-area: map;
	}
	footer {
		grid-area: footer;
	}
</style>
