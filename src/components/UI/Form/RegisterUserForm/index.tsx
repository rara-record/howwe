import AuthStore from 'stores/AuthStore';
import * as yup from 'yup';

import { observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import styled from 'styled-components';
import colors from 'styles/colors';

import Checkbox from 'components/UI/Checkbox';
import { CheckList } from 'properties/CheckList';

interface IFormValues {
  email: string;
  pwd: string;
  checkPwd: string;
}

const RegisterUserForm = () => {
  let navigate = useNavigate();
  const authStore = useContext(AuthStore);

  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
  const [isCheck, setIsCheck] = useState<string[]>([]);
  const [list, setList] = useState<any>([]);

  useEffect(() => {
    setList(CheckList);
  }, [list]);

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    pwd: yup.string().min(7).max(12).required(),
    checkPwd: yup
      .string()
      .oneOf([yup.ref('pwd'), null])
      .required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>({
    resolver: yupResolver(schema),
  });

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(list.map((li: { id: string }) => li.id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const handleClick = e => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter(item => item !== id));
    }
  };

  const onSubmit = async (data: IFormValues) => {
    const enteredEmail = data.email;
    const enteredPassword = data.pwd;
    await authStore.signUp(enteredEmail, enteredPassword);
    !authStore.isAuthFail && navigate('/user/login');
  };

  return (
    <Container>
      <h1 className="register-logo">
        <Link to="/">Caffein</Link>
      </h1>
      <h2 className="register-title">회원가입</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputWrapper>
          <div>
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              {...register('email')}
              placeholder="caffein@abcd.com"
            />
            {errors.email && (
              <span className="error-text">이메일을 다시 확인해주세요.</span>
            )}
          </div>

          <div>
            <label htmlFor="pwd">비밀번호</label>
            <input
              type="password"
              {...register('pwd')}
              placeholder="비밀번호를 입력해주세요"
            />
            {errors.pwd && (
              <span className="error-text">
                비밀번호는 7자리 이상 12자리 이하입니다.
              </span>
            )}
          </div>

          <div>
            <label htmlFor="checkPwd">비밀번호 확인</label>
            <input
              type="password"
              {...register('checkPwd')}
              placeholder="비밀번호를 다시 한 번 입력해주세요"
            />
            {errors.checkPwd && (
              <span className="error-text">비밀번호가 맞지 않습니다.</span>
            )}
          </div>
        </InputWrapper>

        <div className="all-check">
          <Checkbox
            type="checkbox"
            name="selectAll"
            id="selectAll"
            handleClick={handleSelectAll}
            isChecked={isCheckAll}
          />
          <span>전체동의</span>
        </div>

        <CheckBoxList>
          {list.map(({ id, name }) => (
            <li>
              <Checkbox
                key={id}
                type="checkbox"
                name={name}
                id={id}
                handleClick={handleClick}
                isChecked={isCheck.includes(id)}
              />
              <span>{name}</span>
            </li>
          ))}
        </CheckBoxList>

        <ButtonWrapper>
          <button type="submit" className="register-btn">
            확인
          </button>
        </ButtonWrapper>
      </form>
    </Container>
  );
};

export default observer(RegisterUserForm);

const Container = styled.section`
  .register-logo {
    font-size: 1.3rem;
    font-weight: bold;
    color: ${colors.primary1};
    text-transform: uppercase;
  }

  .register-title {
    font-size: 20px;
    font-weight: bold;
    margin: 52px 0 1.2rem;
  }

  input {
    &::placeholder {
      font-size: 0.8rem;
      color: #ccc;
    }
  }

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    margin: 0.4rem 0;
    border-radius: 0.25rem;
    border-width: 2px;
    border-color: #000;
  }

  form {
    span {
      margin: 0 0.4rem;
      font-size: 0.9rem;
      font-weight: 500;
    }
  }

  .all-check {
    display: flex;
    align-items: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid #ddd;

    span {
      font-size: 1.2rem;
      font-weight: bold;
    }
  }
`;

const InputWrapper = styled.div`
  padding: 1.5rem 0;

  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0.3rem 0 1rem;
  }

  label {
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
  }

  input {
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #ddd;

    &:nth-child(1) {
      margin-top: 0;
    }
  }

  .error-text {
    color: #ef4444;
    font-size: 0.7rem;
    margin: 0.8rem 0 1rem;
  }
`;

const CheckBoxList = styled.ul`
  margin: 2rem 0;
  padding-bottom: 1rem;

  li {
    display: flex;
    align-items: center;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  button {
    width: 100%;
    margin: 0.5rem 0;
    padding: 0.75rem;
    font-size: 0.9rem;
    font-weight: bold;
    color: #fff;
    border: 1px solid ${colors.primary1};
    background-color: ${colors.primary1};
    border-radius: 0.5rem;
  }
`;
