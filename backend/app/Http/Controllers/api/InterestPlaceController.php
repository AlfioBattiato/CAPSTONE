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
        $validated = $request->validated();
        $place = InterestPlace::create($validated);
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
