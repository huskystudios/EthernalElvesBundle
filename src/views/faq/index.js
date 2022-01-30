import React from "react";
import { faqs } from "./data";
import './style.css'    



const Faq = () => {





    return (
        <>
            <div className="dark-1000 d-flex faq justify-center items-center">
                <div className="faq-container">
                    <div className="d-flex flex-column">
                        <h1>
                            FAQ
                        </h1>
                        <div className="sector-selection">


                            {faqs.map(faq => (
                                <div className="sector-selection-item" key={faq.id}>
                                    <div className="sector-selection-item-header">
                                        {faq.cat && <h2>{faq.cat}</h2>}
                                        <div className="subcat">{faq.subcat}</div>
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
