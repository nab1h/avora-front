"use client";


import { Button } from "@/components/ui/button";



interface Props {

    current:number;

    last:number;

    setPage:(page:number)=>void;

}



export default function UsersPagination({

    current,

    last,

    setPage

}:Props){


    return (

        <div className="flex justify-end gap-2 mt-5">


            <Button

                variant="outline"

                disabled={current===1}

                onClick={()=>
                    setPage(current-1)
                }

            >

                Previous

            </Button>




            <span className="flex items-center px-3">

                {current} / {last}

            </span>





            <Button

                variant="outline"

                disabled={current===last}

                onClick={()=>
                    setPage(current+1)
                }

            >

                Next

            </Button>



        </div>

    );

}