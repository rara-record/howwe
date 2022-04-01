import { Faq } from 'components';
import styled from 'styled-components';
import { maxWidth } from 'styles/mixin';
import { IFaqs } from 'types/CampDetail';

interface IProps {
  faqs: IFaqs[];
}

const Faqs = ({ faqs }: IProps) => {
  return (
    <Container>
      <div className="inner">
        <h4>FAQ</h4>
        {faqs.map((faq, index) => (
          <Faq key={index} faq={faq}></Faq>
        ))}
      </div>
    </Container>
  );
};

export default Faqs;

const Container = styled.div`
  padding: 60px 0;
  background-color: rgb(252, 252, 252);

  h4 {
    padding-bottom: 18px;
    font-size: 22px;
    font-weight: 600px;
    line-height: 28px;
    ${maxWidth}
  }
`;
