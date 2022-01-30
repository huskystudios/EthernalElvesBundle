import React from "react";
import { faqs } from "./data";
import './style.css'    



const Faq = () => {





    return (
        <>
            <div className="dark-1000 d-flex faq justify-center items-center">
                <div className="faq-container">
                    <div className="d-flex flex-column">
                        <div className="heading">
                            FAQ
                        </div>
                        <div className="sector-selection">


                            {faqs.map(faq => (
                                <div className="sector-selection-item" key={faq.id}>
                                    <div className="sector-selection-item-header">
                                        {faq.cat && <div className="heading">{faq.cat}</div>}
                                      
                                            <div className="question">{faq.question}</div>
                                            <div className="answer">{faq.answer}</div>
                                     </div>
                                </div> ))}      
                                            

                        </div>
                    </div>
                </div>
            </div>
        </>


    );

};

export default Faq;
