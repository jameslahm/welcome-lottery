import styled from '@emotion/styled';

const Button = styled.button`
	padding: 0.7rem 1.2rem;
	font-size: 1rem;
	border-radius: 5px;
	outline: none;

	&:hover {
		filter: saturate(70%);
	}
	&:active {
		filter: saturate(40%);
	}

	border: 1px solid #fff;
	cursor: pointer;
`;

const PrimaryButton = styled(Button)`
	background-image: linear-gradient(135deg, #72c6ef, #004e8f);
`;

export { Button,PrimaryButton };
