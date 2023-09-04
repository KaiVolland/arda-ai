<script lang="ts">
	import type { ChatCompletion } from 'openai/resources/chat';
	import Map from '../lib/components/Map.svelte';
	import { mapStore } from '../stores/map';
	import { addAIAnswerToMap } from '../lib/util/map';

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
				<div class="awaiting-answer">. . .</div>
			{/if}
		</div>
		<div class="chat-prompt">
			<input name="message" autocomplete="off" bind:value={message} />
			<button on:click={onSubmit}>send</button>
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
		grid-template-rows: 50px 1fr 50px;
		grid-template-columns: 1fr 3fr;
	}

	header {
		grid-area: header;
		border: 1px solid gainsboro;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.chat-container {
		grid-area: chat;
		display: flex;
		flex-direction: column;
		.chat-history {
			border: 1px solid gainsboro;
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
			border: 1px solid gainsboro;
			display: flex;

			input {
				flex: 1;
			}
		}
	}
	.map-container {
		grid-area: map;
		border: 1px solid gainsboro;
	}
	footer {
		grid-area: footer;
		border: 1px solid gainsboro;
	}
</style>
