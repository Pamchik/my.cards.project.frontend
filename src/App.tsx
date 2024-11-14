import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './store/store';
import { funcCreateConfigData } from './components/functions/funcCreateConfigData';
import { useLazyUserCheckQuery } from './store/api/userApiSlice';
import { removeUser, setUser } from './store/user/userSlice';
import { removeSessionId, setSessionId } from './store/user/sessionIdSlice';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';


// Импорт стилей
    import 'ag-grid-enterprise'
    import 'ag-grid-community/styles/ag-grid.css';
    import 'ag-grid-community/styles/ag-theme-quartz.css';
    import './static/scss/base.scss';
    import './static/scss/file-upload-form.scss';
    import './static/scss/block-styles.scss';
    import './static/scss/loading-styles.scss';
    import './static/scss/modal-styles.scss';
    import './static/scss/empty-component-styles.scss';
    import './static/scss/button-styles.scss';
    import './static/scss/field-styles.scss';
    import './static/scss/list-styles.scss';
    import './static/scss/navigation-styles.scss';
    import './static/scss/spoiler-styles.scss';
    import './static/scss/tabs-styles.scss';
    import './static/scss/auth.scss';
    import './static/scss/image-gallery.scss'
    import './static/scss/tables-styles.scss'

// Импорт компонентов
    import Sidenav, { ILinks } from './components/UI/navigation/Sidenav';
    import Topnav from './components/UI/navigation/Topnav';
    import AppRouter from './components/routers/AppRouter';
    import LoginRouter from './components/routers/LoginRouter';
    import ModalsCombineComponent from './components/modals/modalsCombineComponent';


const App = () => {
    
    // const [requestedLocation, setRequestedLocation] = useState<string>('')
    // const location = useLocation()
    // const navigate = useNavigate()

    // useEffect(() => {
    //     setRequestedLocation(location.pathname)
    // }, [])

    useEffect(() => {
        funcCreateConfigData()
    }, [])
    
    const user = useSelector((state: RootState) => state.user)
    const sessionId = useSelector((state: RootState) => state.sessionId.id)
    const [checkUser, {data, error}] = useLazyUserCheckQuery()
    const dispatch = useDispatch() 
    const [activeLink, setActiveLink] = useState<string>('')

    
    useEffect(() => {
        const currentSessionId = Cookies.get('sessionid')
        if (currentSessionId) {
            dispatch(setSessionId({id: currentSessionId}))
        } else {
            dispatch(removeUser({}))
        }
    }, [])

    useEffect(() => {
        if (sessionId) {
            checkUser({sessionid: sessionId})
        }
    }, [sessionId]);

    useEffect(() => {
        if (data) {
            dispatch(setUser(data))
            // navigate(requestedLocation)
        } else if (error) {
            dispatch(removeUser({}))
            dispatch(removeSessionId({}))
        }
    }, [data, error]);

    // Список с Links
    const arrLinks: ILinks[] = [
        {
            firstLevel: {
                title: 'Заказы',
                linkName: '/projects/',
            }
        },
        {
            firstLevel: {
                title: 'Документы',
                secondLevel: [
                    // {
                    //     linkName: '/offers/',
                    //     title: 'КП',
                    // },
                    // {
                    //     linkName: '/contract-annexes/',
                    //     title: 'Приложение',
                    // },
                    // {
                    //     linkName: '/purchase-orders/',
                    //     title: 'PO',
                    // },    
                    {
                        linkName: '/templates/',
                        title: 'Шаблоны документов',
                    },    
                    {
                        linkName: '/instructions/',
                        title: 'Инструкции',
                    },              
                ]
            },
        },
        {
            firstLevel: {
                title: 'Технические проекты',
                secondLevel: [
                    {
                        linkName: '/key-exchange/',
                        title: 'Обмен ключами',
                    },
                    {
                        linkName: '/cards-testing/',
                        title: 'Тестовые карты',
                    },               
                ]
            }
        },
        {
            firstLevel: {
                title: 'Справочник',
                linkName: '/dictionary/',
            }
        },
        // {
        //     firstLevel: {
        //         title: 'Расширенный поиск по заказам',
        //         linkName: '/searching_by_orders/',
        //     }
        // },
        {
            firstLevel: {
                title: 'Отчеты',
                linkName: '/reports/',
            }
        },
    ]



    return (
        <div className="wrapper">
            <div className="container">
                <div className="content">
                    {user.username
                        ? 
                            (<>
                                <Sidenav activeLink={activeLink} arrLinks={arrLinks} setActiveLink={setActiveLink} />
                                <ModalsCombineComponent/>
                                <div className="main">
                                    <Topnav/>
                                    <div className="main-body">
                                        <div className="main-body__context">
                                            <AppRouter/>
                                        </div>
                                    </div>
                                </div>                 
                            </>) 
                        : 
                            (user.isCkecked
                                ? <LoginRouter/>
                                : <></>
                            )
                    }
                </div>    
            </div>
        </div>                
    )
}
      
export default App;