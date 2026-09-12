"use client";


import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";


import {
    Button
} from "@/components/ui/button";


import {
    Input
} from "@/components/ui/input";


import {
    Checkbox
} from "@/components/ui/checkbox";

import {
    useGetPermissionsQuery,
    useSyncRolePermissionsMutation,
    useUpdateRoleMutation
} from "@/lib/services/roles-api";


interface Props {

    role:{
        id:number;
        name:string;
        permissions:{
            id:number;
            name:string;
        }[]
    }

}



export default function ManageRoleDialog({
    role
}:Props){


const [open,setOpen]=useState(false);


const [name,setName]=useState(role.name);


const [selected,setSelected]=useState<number[]>(

    role.permissions.map(p=>p.id)

);



const {
    data:permissionsData
}=useGetPermissionsQuery();



const permissions =
    permissionsData?.data ?? [];



const [
    updateRole,
    {
        isLoading:updateLoading
    }
]=useUpdateRoleMutation();



const [
    syncPermissions,
    {
        isLoading:permissionLoading
    }
]=useSyncRolePermissionsMutation();




function togglePermission(id:number){

    setSelected(prev=>

        prev.includes(id)

        ? prev.filter(x=>x!==id)

        : [...prev,id]

    );

}




async function save(){


    await updateRole({

        id:role.id,

        name

    });



    await syncPermissions({

        id:role.id,

        permissions:selected

    });



    setOpen(false);

}




return (

<Dialog
open={open}
onOpenChange={setOpen}
>


<Button
variant="ghost"
onClick={()=>setOpen(true)}
>
Manage Permissions
</Button>



<DialogContent>


<DialogHeader>

<DialogTitle>
Manage Role
</DialogTitle>

</DialogHeader>



<div className="space-y-5">


<Input

value={name}

onChange={(e)=>setName(e.target.value)}

placeholder="Role name"

/>



<div className="space-y-3">

<h3 className="font-medium">
Permissions
</h3>


{
permissions.map(permission=>(


<div
key={permission.id}
className="flex items-center gap-3"
>


<Checkbox

checked={
selected.includes(permission.id)
}

onCheckedChange={()=>togglePermission(permission.id)}

/>


<span>
{permission.name}
</span>


</div>


))

}


</div>




<Button

className="w-full"

onClick={save}

disabled={
updateLoading ||
permissionLoading
}

>

Save Changes

</Button>


</div>


</DialogContent>


</Dialog>


)

}