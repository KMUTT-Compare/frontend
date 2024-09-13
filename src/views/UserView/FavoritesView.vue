<script setup>

</script>
 
<template>
<div class="w-full h-full flex flex-col mt-20 items-center">
    
    <div class=" w-full flex justify-center bg-red-500 p-10">
        <h1 class="text-5xl">รายการโปรดของฉัน</h1>
    </div>

    <div class="flex flex-col p-10 w-3/5 h-full bg-yellow-500">
        
        <!-- Items Number 1 -->
        <div class="number-one flex flex-row bg-blue-500">
            <!-- ซ้าย -->
            <div class="flex flex-col w-1/4 items-center">
                <div class="flex flex-row bg-pink-200 items-start w-full p-2 items-center justify-center">
                    
                    <div class="flex w-full justify-center pl-12">
                        <h1 class="text-5xl">อันดับที่ 1</h1>
                    </div>
                    
                    <div class="flex w-1/5 justify-end">
                        <img src="@/components/icons/rank.png"/>
                    </div>
                </div>

                <div class="img-number-one flex w-full justify-center">
                    <img src="@/components/photos/item.svg" class="rounded-lg shadow-2xl" alt="Dormitory Image" />
                </div>
            </div>
            <!-- ขวา -->
             <div class="flex flex-col bg-green-700 w-3/4 p-10">
                <div class="flex flex-row justify-between">
                    <h1 class="text-4xl">หอของเจ๋งจี้</h1>
                    <p class="text-4xl">Score: 10/10</p>
                </div>

                <p>กราฟ</p>
             </div>
        </div>

        <!-- List Items -->
         <div class="mt-10">


           <!-- responsive table-->
<div class="mt-2 items-center flex w-full bg-red-600 justify-center">
      <table class="max-w-fit table-auto">
        <thead class="justify-between">
          <tr class="bg-green-600">
            <th class="px-16 py-2">
              <span class="text-gray-100 font-semibold">Avatar</span>
            </th>
            <th class="px-16 py-2">
              <span class="text-gray-100 font-semibold">Name</span>
            </th>
          
            <th class="px-16 py-2">
              <span class="text-gray-100 font-semibold">Date</span>
            </th>

            <th class="px-16 py-2">
              <span class="text-gray-100 font-semibold">Time</span>
            </th>

            <th class="px-16 py-2">
              <span class="text-gray-100 font-semibold">Setting</span>
            </th>
          </tr>
        </thead>
        
        <tbody class="bg-gray-200">
          <tr class="bg-white border-b-2 border-gray-200">
            <td class="px-16 py-2 flex flex-row items-center">
              <img
                class="h-8 w-8 rounded-full object-cover "
                src="https://randomuser.me/api/portraits/men/30.jpg"
                alt=""
              />
            </td>
            <td>
              <span class="text-center ml-2 font-semibold">John Doe</span>
            </td>
           
            <td class="px-16 py-2">
              <span>05/06/2020</span>
            </td>
            <td class="px-16 py-2">
              <span>10:00</span>
            </td>

            <td class="px-16 py-2">
              <span class="text-yellow-500 flex">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-700" viewBox="0 0 20 20" fill="currentColor">
                 <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              </span>
            </td>
          </tr>
          <tr class="bg-white border-b-2 border-gray-200">
            <td class="px-16 py-2 flex flex-row items-center">
            <img
                  class="h-8 w-8 rounded-full object-cover "
                  src="https://randomuser.me/api/portraits/men/76.jpg"
                  alt=""
                />
            </td>
            <td>
              <span class="text-center ml-2 font-semibold">John Frillo</span>
            </td>
           
            <td class="px-16 py-2">
              <span>05/06/2020</span>
            </td>
            <td class="px-16 py-2">
              <span>12:15</span>
            </td>

            <td class="px-16 py-2">
                <span class="text-yellow-500 flex">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-700" viewBox="0 0 20 20" fill="currentColor">
                 <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              </span>
            </td>
          </tr>
          <tr class="bg-white border-b-2 border-gray-200">
            <td class="px-16 py-2 flex flex-row items-center">
            <img
                  class="h-8 w-8 rounded-full object-cover "
                  src="https://randomuser.me/api/portraits/men/38.jpg"
                  alt=""
                />
            </td>
            <td>
              <span class="text-center ml-2 font-semibold">Brett Castillo</span>
            </td>
            
            <td class="px-16 py-2">
              <span>05/06/2020</span>
            </td>
            <td class="px-16 py-2">
              <span>08:35</span>
            </td>

            <td class="px-16 py-2">
                <span class="text-yellow-500 flex">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-700" viewBox="0 0 20 20" fill="currentColor">
                 <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
         </div>



    </div>

</div>
</template>
 
<style scoped>
</style>