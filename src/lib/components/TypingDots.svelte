<div class="typing">
	<i />
	<i />
	<i />
</div>

<style lang="less">
	.typing {
		display: flex;
		position: relative;
		padding: 0.25em;
		--dot-width: 0.5em;
		--dot-color: #3b5998;
		--speed: 1.5s;

		i {
			display: inline-block;
			animation: blink var(--speed) infinite;
			animation-fill-mode: both;
			height: var(--dot-width);
			width: var(--dot-width);
			background: var(--dot-color);
			border-radius: 50%;

			&:nth-child(2) {
				margin-left: 0.25em;
				animation-delay: 0.2s;
			}

			&:nth-child(3) {
				margin-left: 0.25em;
				animation-delay: 0.4s;
			}
		}
	}

	@keyframes blink {
		0% {
			opacity: 0.1;
		}
		20% {
			opacity: 1;
		}
		100% {
			opacity: 0.1;
		}
	}
</style>
