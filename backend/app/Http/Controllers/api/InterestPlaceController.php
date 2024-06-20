<?php

namespace App\Http\Controllers\api;

use App\Models\InterestPlace;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInterestPlaceRequest;
use App\Http\Requests\UpdateInterestPlaceRequest;
use Illuminate\Http\Request;

class InterestPlaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $places = InterestPlace::all();
        return response()->json($places);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Not typically used in API controllers
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInterestPlaceRequest $request)
    {
        $request->validate([
            'name_location' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'location_img' => ['required', 'image', 'max:1024'],
        ]);
    
        $data = $request->only(['name_location', 'description', 'lat', 'lon', 'user_id']);
        // Ensure lat and lon are included in your form or request payload
    
        $file_path = $request->file('location_img')->store('interestPlaces', 'public');
    
        $place = new InterestPlace();
        $place->name_location = $data['name_location'];
        $place->description = $data['description'];
        $place->lat = $data['lat']; // Make sure 'lat' exists in the request
        $place->lon = $data['lon']; // Make sure 'lon' exists in the request
        $place->user_id = $data['user_id'];      
        $place->rating = 0;
        $place->location_img = 'http://localhost:8000/storage/' . $file_path; // Use url() to generate URL
        $place->save();
    
        $place->load('user');
    
        return response()->json($place, 201); // Created
    }
    

    /**
     * Display the specified resource.
     */
    public function show(InterestPlace $interestPlace)
    {
        return response()->json($interestPlace);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InterestPlace $interestPlace)
    {
        // Not typically used in API controllers
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInterestPlaceRequest $request, InterestPlace $interestPlace)
    {
        $validated = $request->validated();
        $interestPlace->update($validated);
        return response()->json($interestPlace);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InterestPlace $interestPlace)
    {
        $interestPlace->delete();
        return response()->json(null, 204); // No Content
    }
}
