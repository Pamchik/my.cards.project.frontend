import { useEffect, useState } from 'react';
import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";
import BtnBlock from './BtnBlock';
import ButtonMain from '../UI/buttons/ButtonMain';
import ContentBlock from './ContentBlock';
import { IGalleries, useOpenGalleryMutation } from '../../store/api/galleryApiSlice';
import { funcDownloadFile } from '../functions/funcDownloadFile';
import { useDispatch } from 'react-redux';
import { setModalProps } from '../../store/modalData/modalsPropsDataSlice';
import { setModalOpen } from '../../store/modalData/modalsSlice';
import { funcGetConfigDataFromLocalStorage } from '../functions/funcGetConfigDataFromLocalStorage';
import LoadingView from '../loading/LoadingView';
import { functionErrorMessage } from '../functions/functionErrorMessage';
import { setSavingStatus } from '../../store/componentsData/savingProcessSlice';

interface GalleryBlockType {
    arrFiles: IGalleries[]
    selectedID: number
    model_type: string
    isLoading?: {status: boolean, isSuccessful?: boolean},
}


function GalleryBlock({
    arrFiles,
    selectedID,
    model_type,
    isLoading
}: GalleryBlockType) {

    const dispatch = useDispatch()

    const [openGallery, {}] = useOpenGalleryMutation()

    const baseUrl = funcGetConfigDataFromLocalStorage()?.API_Url
    const baseMediaUrl = funcGetConfigDataFromLocalStorage()?.Media_ROOT
    const fullBaseUrl = baseUrl + "/" + baseMediaUrl;

    const [imageMathingDictionary, setImageMathingDictionary] = useState<{index: number, file: IGalleries}[]>([])
    const [imagesAndVideo, setImagesAndVideo] = useState<ReactImageGalleryItem[]>([])

    useEffect(() => {
        const data: ReactImageGalleryItem[] = []
        const dictionary: {index: number, file: IGalleries}[] = []

        if (baseUrl && baseMediaUrl) {
            arrFiles.forEach((item) => {
                if (item.file_type === 'image') {
                    data.push({
                        original: new URL(encodeURIComponent(item.file), fullBaseUrl).href,
                        thumbnail: new URL(encodeURIComponent(item.file), fullBaseUrl).href,
                    })
                    dictionary.push({
                        index: dictionary.length,
                        file: item 
                    })
                } else if (item.file_type === 'video') {
                    data.push({
                        original: new URL(encodeURIComponent(item.file), fullBaseUrl).href,
                        thumbnail: new URL(encodeURIComponent(item.preview_image), fullBaseUrl).href,
                        renderItem: renderVideoItem
                    })
                    dictionary.push({
                        index: dictionary.length,
                        file: item 
                    })
                }
            })
        }
        setImagesAndVideo(data)
        setImageMathingDictionary(dictionary)
    }, [arrFiles]);

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    
    const [currentObjData, setCurrentObjData] = useState<{index: number, file: IGalleries}>();
    useEffect(() => {
        if (imageMathingDictionary.length === 1) {
            setCurrentObjData(imageMathingDictionary.find(item => item.index === 0))    
        } else {
            setCurrentObjData(imageMathingDictionary.find(item => item.index === currentIndex))  
        }
    }, [imageMathingDictionary, currentIndex, imagesAndVideo]);

    const [showFullscreenButtonActive, setShowFullscreenButtonActive] = useState<boolean>(false)

    const handleSlide = (currentIndex: number) => {
        setCurrentIndex(currentIndex);
    };

    useEffect(() => {
        if (imagesAndVideo.length > 0) {
            const isVideoSlide = imagesAndVideo[currentIndex]?.renderItem === renderVideoItem;
            setShowFullscreenButtonActive(!isVideoSlide);            
        } else {
            setShowFullscreenButtonActive(false); 
        }
    }, [currentObjData]);

    function funcDownload () {
        if (currentObjData?.file.file && currentObjData?.file.name) {
            funcDownloadFile(currentObjData?.file.file, currentObjData?.file.name)
        }
    }

    async function funcOpenFileLocation () {
        await openGallery({
            folder_name: currentObjData?.file.folder_name,
            action: "open-location"
        }).unwrap()
        .then((res) => {

        }).catch((error) => {
            const message = functionErrorMessage(error)
        })  
    }

    if (isLoading?.status) 
        return <LoadingView myStyleContainer={{backgroundColor: 'rgba(255, 255, 255, 0)'}}/>
    return (
        <>
            <BtnBlock>
                {
                    (imageMathingDictionary.length > 0 && currentObjData) && (<>
                        <ButtonMain
                            onClick={() => {}}
                            type={'other'} 
                            color={'gray'}
                            title={'Редактировать'}
                            drop={true}
                            actions={[
                                {
                                    name: "Изменить название", 
                                    onClick: () => {
                                        dispatch(setModalProps({componentName: 'ChangeFileDataModal', data: {
                                            objInputData: {
                                                name: currentObjData.file.name,
                                            },
                                            objChangedData: {
                                                action: 'change-name',
                                                file: currentObjData.file.file
                                            },
                                            other: {
                                                file_type: 'gallery'
                                            },
                                            qtyFieldsForSavingBtn: 2
                                        }}))
                                        dispatch(setModalOpen('ChangeFileDataModal'))
                                    }
                                },
                                {
                                    name: "Изменить комментарий", 
                                    onClick: () => {
                                        dispatch(setModalProps({componentName: 'ChangeFileDataModal', data: {
                                            objInputData: {
                                                other: currentObjData.file.other,
                                            },
                                            objChangedData: {
                                                action: 'change-comment',
                                                file: currentObjData.file.file
                                            },
                                            other: {
                                                file_type: 'gallery'
                                            },
                                            qtyFieldsForSavingBtn: 2
                                        }}))
                                        dispatch(setModalOpen('ChangeFileDataModal'))
                                    }
                                },
                                {
                                    name: "Изменить расположение", 
                                    onClick: () => {
                                        dispatch(setModalProps({componentName: 'ChangeFileDataModal', data: {
                                            objInputData: {
                                                folder_name: currentObjData.file.folder_name,
                                            },
                                            objChangedData: {
                                                action: 'change-folder',
                                                file: currentObjData.file.file
                                            },
                                            other: {
                                                file_type: 'gallery'
                                            },
                                            qtyFieldsForSavingBtn: 2
                                        }}))
                                        dispatch(setModalOpen('ChangeFileDataModal'))
                                    }
                                },
                                {
                                    name: "Отправить в архив", 
                                    onClick: () => {
                                        dispatch(setModalProps({componentName: 'ChangeFileDataModal', data: {
                                            objChangedData: {
                                                action: 'to-archive',
                                                id: currentObjData.file.id
                                            },
                                            other: {
                                                title: 'Вы уверены, что хотите отправить в архив?',
                                                file_type: 'gallery'
                                            }
                                        }}))
                                        dispatch(setModalOpen('ChangeFileDataModal'))                                
                                    },
                                    myStyle: {color: 'red'}
                                },
                                {
                                    name: "Удалить файл", 
                                    onClick: () => {
                                        dispatch(setModalProps({componentName: 'ChangeFileDataModal', data: {
                                            objChangedData: {
                                                action: 'delete-file',
                                                file: currentObjData.file.file
                                            },
                                            other: {
                                                title: 'Вы уверены, что хотите полностью удалить файл?',
                                                file_type: 'gallery'
                                            }
                                        }}))
                                        dispatch(setModalOpen('ChangeFileDataModal'))    
                                    },
                                    myStyle: {color: 'red'}
                                },
                            ]}
                            myStyle={{padding: '0 10px', width: '130px'}}
                        />
                    {/* <ButtonMain 
                        onClick={funcOpenFileLocation}
                        type={'other'} 
                        color={'gray'}
                        title={'Открыть папку'}
                        myStyle={{padding: '0 10px', width: '130px'}}
                    /> */}
                        <ButtonMain 
                            onClick={funcDownload}
                            type={'other'} 
                            color={'gray'}
                            title={'Скачать'}
                        />
                    </>)
                }
                <ButtonMain
                    onClick={() => {
                        dispatch(setModalProps({componentName: 'AddNewFileModal', data: {
                            objChangedData: {
                                model_type: model_type,
                                number: selectedID,
                                action: 'add-new-file'
                            },
                            other: {
                                model_name: 'gallery',
                                model_type: model_type.toLowerCase(),
                                action: 'AddNewFile',
                                file_type: 'gallery',
                                number: selectedID
                            }
                        }}))
                        dispatch(setModalOpen('AddNewFileModal'))                            
                    }}
                    type={'other'}
                    title={'Добавить новый файл'}
                    color={'gray'}
                    myStyle={{padding: '0 10px', width: '170px'}}
                />
            </BtnBlock>
            <ContentBlock myStyleMain={{overflowY: 'hidden'}} myStyleContent={{display: 'flex', alignItems: 'center', flexDirection: 'column', paddingTop: '30px', paddingBottom: '30px', height: '100%'}}>
                <div className="gallery-container" style={{width: '40%', height: '100%', overflow: 'hidden'}}>
                    <ImageGallery 
                        items={imagesAndVideo} 
                        showThumbnails={true} 
                        thumbnailPosition={'top'} 
                        showPlayButton={false}
                        onSlide={(index) => handleSlide(index)}
                        showFullscreenButton={showFullscreenButtonActive}
                        renderItem={renderItem}
                    />
                </div>
                {currentObjData && 
                    <div style={{display: 'block', height: '10%', width: '90%'}}>
                        <div style={{display: 'flex', height: '45px', width: '100%', flexDirection: 'column', backgroundColor: '#8080804a', borderRadius: '5px'}}>
                            <div style={{display: 'line-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '5px'}}>
                                <span>Название: </span><b>{currentObjData?.file.name}</b>
                            </div>
                            <div style={{display: 'line-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '5px'}}>
                                <span>Описание: </span><b>{currentObjData?.file.other}</b>
                            </div>
                        </div>
                    </div>
                }
            </ContentBlock>
        </>    
    )
}

function renderItem(item: any) {
    if (item && typeof item.renderItem === 'function') {
      return item.renderItem(item);
    }
  
    return (
      <>
        <img alt={item.description} className="image-gallery-image" src={item.original}/>
        {/* {item.description && (
        <span className="image-gallery-description">{item.description}</span>
        )} */}
      </>
    );
  }


  function renderVideoItem(item: any) {

    return (
        <>
            <div className="video-wrapper">
                <video
                    controls
                    src={item.original}
                    className="video-wrapper-video"
                >
                    Ваш браузер не поддерживает данное видео.
                </video>
            </div>
        </>
    );
}


  
    export default GalleryBlock