import React, {useEffect, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import ReactPaginate from 'react-paginate';
import {LazyLoadImage} from 'react-lazy-load-image-component';

const basUrl = process.env.NEXT_PUBLIC_BASE_URL

interface IProductImage {
    id: number
    url: string
    score?: string
}

interface IProduct {
    id: number
    keywords: string
    image_count: number
    images: IProductImage[]
}

const ProductList = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(0)
    const itemsPerPage = 8;

    const [products, setProducts] = useState<IProduct[]>([])

    // useEffect(() => {
    //     fetch(`${basUrl}/api/products/`)
    //         .then(response => response.json())
    //         .then(data => {
    //             setCount(data?.count ?? 0)
    //             setProducts(data?.results ?? [])
    //         })
    //         .catch(error => console.log(error));
    // }, []);

    useEffect(() => {
        fetch(`${basUrl}/api/products/?page=${currentPage}`)
            .then(response => response.json())
            .then(data => {
                console.log(data.results, 444)
                setCount(data?.count ?? 0)
                setProducts(data?.results ?? [])
            })
            .catch(error => console.log(error));
    }, [currentPage])

    const handlePageChange = (selected: any) => {
        setCurrentPage(selected.selected);
    };

    const openModal = (product: IProduct) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setShowModal(false);
    };

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded p-4">
                        <h2 className="text-lg font-bold mb-2">{product.keywords}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {product.images.map((image) => (
                                <LazyLoadImage

                                    key={image.id}
                                    src={image.url}
                                    alt="Product Image"
                                    className="cursor-pointer"
                                    onClick={() => openModal(product)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <ReactPaginate
                pageCount={Math.ceil(count / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName="flex justify-center mt-4"
                pageClassName="px-3 py-2 cursor-pointer hover:bg-gray-200 rounded"
                activeLinkClassName="bg-gray-200"
                previousClassName="mr-2 px-3 py-2 cursor-pointer hover:bg-gray-200 rounded"
                nextClassName="ml-2 px-3 py-2 cursor-pointer hover:bg-gray-200 rounded"
                breakClassName="px-3 py-2 cursor-pointer hover:bg-gray-200 rounded"
            />

            <Transition.Root show={showModal} as={React.Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={closeModal}
                >
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30"/>
                        </Transition.Child>

                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="relative max-w-3xl w-full">
                                <Dialog.Title className="text-lg font-bold text-center mb-4">
                                    Product Images - {selectedProduct?.keywords}
                                </Dialog.Title>

                                <div className="grid grid-cols-3 gap-4">
                                    {selectedProduct?.images.map((image) => (
                                        <LazyLoadImage
                                            key={image.id}
                                            src={image.url}
                                            alt="Product Image"
                                            className="cursor-pointer"
                                            onClick={() => openModal(selectedProduct)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

export default ProductList;
