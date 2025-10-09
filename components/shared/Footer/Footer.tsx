import React from 'react'
import "./Footer.css"

const Footer = () => {
  return (
    <>
        
        <footer className='footer mt-180 md:mt-0'>
            <div className='footer-sections p-6 flex items-center flex-col md:flex md:flex-row'>
                <div>
                    <h3>Личный кабинет</h3>
                    <ul>
                        <li><a href="sign-up">Регистрация</a></li>
                        <br />
                        <li><a href="sign-in">Войти</a></li>
                    </ul>
                </div>
                <div>
                    <h3>Тех.поддержка</h3>
                    <ul>
                        <li>
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=zakir7182@gmail.com&su=Вопрос%20по%20сайту&body=Здравствуйте%2C%20..." target="_blank" rel="noopener noreferrer">Почта: zakir7182@gmail.com</a>
                        </li>
                        <br />
                        <li><a href="#">Телефон: 88-71-82</a></li>
                    </ul>
                </div>
                <div>
                    <h3>Контакты</h3>
                    <ul>
                        <li><a href="https://www.instagram.com/eldowxl/">@eldowxl</a></li>
                        <li><a href="https://www.instagram.com/yatogorot_/">@yatogorot</a></li>
                        <li><a href="https://www.instagram.com/ab1lmns/">@ab1lmns</a></li>
                    </ul>
                </div>
            </div>
            <p className='copyright'>Copyright © 2025 Zakir Technology Co.Ltd.</p>
        </footer>
    </>
  )
}

export default Footer